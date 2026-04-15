#!/usr/bin/env node
/**
 * ETL Orchestrator — Ireland Civic Data Project
 *
 * Runs all ETL scripts in sequence and produces a master run report.
 * Includes QA checks on each output: null value rates, row counts, suspicious outliers.
 *
 * Usage:
 *   node etl/run_all.js              — run all ETLs
 *   node etl/run_all.js --qa-only   — run QA checks only (no re-fetch)
 *   node etl/run_all.js --cso       — run CSO ETL only
 *   node etl/run_all.js --eurostat  — run Eurostat ETL only
 *   node etl/run_all.js --ogp       — run OGP procurement ETL only
 *
 * Output: data/processed/run_report.json
 */

const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ETL_DIR = __dirname;
const PROCESSED_DIR = path.join(__dirname, "../data/processed");
const REPORT_PATH = path.join(PROCESSED_DIR, "run_report.json");

const args = process.argv.slice(2);
const QA_ONLY = args.includes("--qa-only");
const RUN_CSO = args.includes("--cso") || (!args.length || args.includes("--all"));
const RUN_EUROSTAT = args.includes("--eurostat") || (!args.length || args.includes("--all"));
const RUN_OGP = args.includes("--ogp") || (!args.length || args.includes("--all"));

// ── ETL Runner ─────────────────────────────────────────────────────────────

function runScript(scriptName) {
  const scriptPath = path.join(ETL_DIR, scriptName);
  console.log(`\n${"─".repeat(60)}`);
  console.log(`Running: ${scriptName}`);
  console.log("─".repeat(60));

  const start = Date.now();
  const result = spawnSync("node", [scriptPath], {
    stdio: "inherit",
    encoding: "utf8",
  });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  if (result.status !== 0) {
    console.error(`\n✗ ${scriptName} exited with code ${result.status}`);
    return { script: scriptName, status: "error", elapsed_s: elapsed };
  }
  return { script: scriptName, status: "ok", elapsed_s: elapsed };
}

// ── QA Checks ──────────────────────────────────────────────────────────────

/**
 * Run QA checks on all processed JSON files.
 * Returns an array of QA result objects.
 */
function runQA() {
  console.log(`\n${"═".repeat(60)}`);
  console.log("QA CHECKS");
  console.log("═".repeat(60));

  const processedFiles = fs
    .readdirSync(PROCESSED_DIR)
    .filter((f) => f.endsWith(".json") && !f.endsWith("_manifest.json") && f !== "run_report.json");

  const qaResults = [];

  for (const filename of processedFiles) {
    const filepath = path.join(PROCESSED_DIR, filename);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filepath, "utf8"));
    } catch (e) {
      qaResults.push({ file: filename, status: "parse_error", error: e.message });
      continue;
    }

    const result = { file: filename, status: "ok", checks: [] };

    // ── Check 1: Row / value count ──────────────────────────────────────
    const rowCount = data.raw_size || data.meta?.total_rows || data.rows?.length || 0;
    result.row_count = rowCount;

    if (rowCount === 0) {
      result.checks.push({ check: "row_count", severity: "error", message: "Zero rows — empty dataset" });
      result.status = "fail";
    } else {
      result.checks.push({ check: "row_count", severity: "ok", message: `${rowCount} rows` });
    }

    // ── Check 2: Null / missing values in numeric data ──────────────────
    if (data.values !== undefined) {
      const values = data.values;
      const entries = Array.isArray(values) ? values : Object.values(values);
      const total = entries.length;
      const nullCount = entries.filter((v) => v === null || v === undefined || v === "").length;
      const nullRate = total > 0 ? ((nullCount / total) * 100).toFixed(1) : "n/a";

      result.null_rate_pct = parseFloat(nullRate);

      if (nullRate > 50) {
        result.checks.push({
          check: "null_rate",
          severity: "warn",
          message: `High null rate: ${nullRate}% (${nullCount}/${total}) — normal for sparse Eurostat matrices`,
        });
      } else {
        result.checks.push({ check: "null_rate", severity: "ok", message: `Null rate ${nullRate}%` });
      }

      // ── Check 3: Extreme outliers (numeric values only) ─────────────
      const numeric = entries.filter((v) => typeof v === "number" && !isNaN(v));
      if (numeric.length > 10) {
        const sorted = [...numeric].sort((a, b) => a - b);
        const p99 = sorted[Math.floor(sorted.length * 0.99)];
        const p01 = sorted[Math.floor(sorted.length * 0.01)];
        const max = sorted[sorted.length - 1];
        const min = sorted[0];

        // Flag if max is >100× the 99th percentile (suggests bad data, not just outliers)
        // NOTE: prc_ppp_ind includes EXP_NAC (total national expenditure in millions of national
        // currency) alongside per-capita indices — the large range is expected and correct.
        const knownWideRange = ['prc_ppp_ind'];
        const datasetCode = data.meta?.dataset_code || '';
        if (p99 > 0 && max > p99 * 100 && !knownWideRange.includes(datasetCode)) {
          result.checks.push({
            check: "outlier",
            severity: "warn",
            message: `Possible extreme outlier: max=${max}, p99=${p99} — check manually`,
          });
        } else {
          result.checks.push({
            check: "outlier",
            severity: "ok",
            message: `Value range: ${min} – ${max} (p1=${p01}, p99=${p99})`,
          });
        }
      }
    }

    // ── Check 4: For OGP row-based data, check key fields ──────────────
    if (data.rows && Array.isArray(data.rows) && data.rows.length > 0) {
      const sample = data.rows.slice(0, 100);
      const keys = Object.keys(sample[0] || {});
      result.columns = keys.length;

      // Check for rows with nearly all empty fields
      const thinRows = sample.filter(
        (r) => Object.values(r).filter((v) => v && v.toString().trim()).length < keys.length * 0.3
      ).length;

      if (thinRows > sample.length * 0.2) {
        result.checks.push({
          check: "thin_rows",
          severity: "warn",
          message: `${thinRows}/${sample.length} sampled rows have <30% fields populated`,
        });
      } else {
        result.checks.push({ check: "thin_rows", severity: "ok", message: "Row completeness OK" });
      }
    }

    // ── Check 5: Meta fields present ────────────────────────────────────
    const requiredMeta = ["source", "license", "attribution", "fetched_at"];
    const meta = data.meta || {};
    const missingMeta = requiredMeta.filter((f) => !meta[f]);
    if (missingMeta.length > 0) {
      result.checks.push({
        check: "meta_fields",
        severity: "warn",
        message: `Missing meta fields: ${missingMeta.join(", ")}`,
      });
    } else {
      result.checks.push({ check: "meta_fields", severity: "ok", message: "All required meta fields present" });
    }

    // Aggregate status
    const hasError = result.checks.some((c) => c.severity === "error");
    const hasWarn = result.checks.some((c) => c.severity === "warn");
    result.status = hasError ? "fail" : hasWarn ? "warn" : "ok";

    const icon = result.status === "ok" ? "✓" : result.status === "warn" ? "⚠" : "✗";
    console.log(`\n${icon} ${filename} (${rowCount} rows)`);
    result.checks.forEach((c) => {
      const cIcon = c.severity === "ok" ? "  ✓" : c.severity === "warn" ? "  ⚠" : "  ✗";
      console.log(`${cIcon} [${c.check}] ${c.message}`);
    });

    qaResults.push(result);
  }

  return qaResults;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║   Ireland Civic Data Project — ETL Orchestrator          ║");
  console.log(`║   ${new Date().toISOString()}                  ║`);
  console.log("╚══════════════════════════════════════════════════════════╝");

  const etlResults = [];

  if (!QA_ONLY) {
    if (RUN_CSO) etlResults.push(runScript("fetch_cso.js"));
    if (RUN_EUROSTAT) etlResults.push(runScript("fetch_eurostat.js"));
    if (RUN_OGP) etlResults.push(runScript("fetch_ogp.js"));
  }

  const qaResults = runQA();

  // ── Summary ──────────────────────────────────────────────────────────────
  const passCount = qaResults.filter((r) => r.status === "ok").length;
  const warnCount = qaResults.filter((r) => r.status === "warn").length;
  const failCount = qaResults.filter((r) => r.status === "fail").length;

  console.log(`\n${"═".repeat(60)}`);
  console.log("SUMMARY");
  console.log("═".repeat(60));
  console.log(`  ETL scripts:  ${etlResults.filter((r) => r.status === "ok").length}/${etlResults.length} ok`);
  console.log(`  QA checks:    ${passCount} pass | ${warnCount} warn | ${failCount} fail`);

  const report = {
    generated_at: new Date().toISOString(),
    etl_runs: etlResults,
    qa: qaResults,
    summary: {
      etl_ok: etlResults.filter((r) => r.status === "ok").length,
      etl_total: etlResults.length,
      qa_pass: passCount,
      qa_warn: warnCount,
      qa_fail: failCount,
    },
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\n  Report saved: data/processed/run_report.json`);

  if (failCount > 0) {
    console.log("\n⚠ Some QA checks failed. Review run_report.json for details.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Orchestrator error:", err);
  process.exit(1);
});
