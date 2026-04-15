/**
 * ETL: OGP Procurement Contracts (data.gov.ie / assets.gov.ie)
 * Ireland Civic Data Project
 *
 * Fetches quarterly procurement contract CSV files published by the
 * Office of Government Procurement (OGP) via data.gov.ie / assets.gov.ie
 * and normalises them to a canonical JSON format.
 *
 * Data sources:
 *   - OGP Mini-Competition & Standalone Awards (quarterly CSVs, 2023 Q1–Q4 + 2024 Q1–Q4)
 *   - eTenders bulk open dataset (all contract notices)
 *
 * Pillar: procurement_contracts
 * License: CC BY 4.0 — attribute Office of Government Procurement / data.gov.ie
 *
 * Notes on structure:
 *   Quarterly "awards" files: Name of Contracting Authority, Title of Contract,
 *     Suppliers, Award Confirmed Date, Start/End Dates, CPV codes
 *   eTenders bulk: Tender ID, Contracting Authority, Tender Name, Notice Date,
 *     Directive, CPV Code, Competition Type, Awarded Value (€), No of Bids, etc.
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../data/processed");
const RAW_DIR = path.join(__dirname, "../data/raw");

// ── Data source definitions ────────────────────────────────────────────────

const QUARTERLY_AWARDS = [
  {
    id: "2023_q1q4",
    label: "OGP Mini-Competition & Standalone Awards 2023 (Q1–Q4)",
    url: "https://assets.gov.ie/303795/35e155b2-58ac-434a-b214-e6c0de9449bd.csv",
    year: 2023,
    quarter: "Q1-Q4",
  },
  {
    id: "2024_q1",
    label: "OGP Mini-Competition & Standalone Awards 2024 Q1",
    url: "https://assets.gov.ie/303796/363a6c7e-2360-4f27-80d1-91f7a8e5abfe.csv",
    year: 2024,
    quarter: "Q1",
  },
  {
    id: "2024_q2",
    label: "OGP Mini-Competition & Standalone Awards 2024 Q2",
    url: "https://assets.gov.ie/303797/8ea94da5-f8ce-4167-91a0-1d9a1e18a118.csv",
    year: 2024,
    quarter: "Q2",
  },
  {
    id: "2024_q3",
    label: "OGP Mini-Competition & Standalone Awards 2024 Q3",
    url: "https://assets.gov.ie/309000/b94708d0-569f-40a8-8923-a8773d1be4af.csv",
    year: 2024,
    quarter: "Q3",
  },
  {
    id: "2024_q4",
    label: "OGP Mini-Competition & Standalone Awards 2024 Q4",
    url: "https://assets.gov.ie/320030/f49a3061-40a7-40b7-8d79-39c97cc2b768.csv",
    year: 2024,
    quarter: "Q4",
  },
];

const ETENDERS_BULK = {
  id: "etenders_bulk",
  label: "eTenders Contract Notices (bulk open dataset)",
  url: "https://assets.gov.ie/static/documents/7ba65f1b/Public_Procurement_Opendata_Dataset.csv",
  note: "Full eTenders notice history — includes awarded values, CPV codes, no. of bids, SME share",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return fetchCSV(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

/**
 * Minimal CSV parser — handles BOM, quoted fields, and Windows line endings.
 * Sufficient for the OGP datasets which are simple delimited text.
 */
function parseCSV(text) {
  // Strip BOM
  const clean = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = clean.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] || "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Fetch & normalise ──────────────────────────────────────────────────────

async function fetchQuarterlyAwards() {
  console.log("=== OGP Quarterly Award Contracts ===\n");
  const allRows = [];
  const results = [];

  for (const src of QUARTERLY_AWARDS) {
    console.log(`Fetching ${src.id} — ${src.label}...`);
    try {
      const csv = await fetchCSV(src.url);
      const rows = parseCSV(csv);

      // Tag each row with year/quarter for lineage
      rows.forEach((r) => {
        r._source_period = `${src.year} ${src.quarter}`;
        r._source_file = src.id;
      });

      allRows.push(...rows);

      // Save raw CSV
      fs.writeFileSync(path.join(RAW_DIR, `ogp_awards_${src.id}_raw.csv`), csv);

      console.log(`  ✓ ${src.id}: ${rows.length} rows`);
      results.push({ id: src.id, status: "ok", rows: rows.length });
    } catch (err) {
      console.error(`  ✗ ${src.id} failed: ${err.message}`);
      results.push({ id: src.id, status: "error", error: err.message });
    }
    await delay(600);
  }

  // Save merged processed output
  const processed = {
    meta: {
      source: "OGP / data.gov.ie",
      dataset_label: "Mini-Competition and Standalone Contract Awards 2023–2024",
      license: "CC BY 4.0",
      attribution: "Office of Government Procurement (OGP), Ireland",
      url: "https://data.gov.ie/dataset/contracts-for-mini-competitions-and-standalone-awards",
      fetched_at: new Date().toISOString(),
      pillars: ["procurement_contracts"],
      periods: QUARTERLY_AWARDS.map((s) => `${s.year} ${s.quarter}`),
      total_rows: allRows.length,
    },
    rows: allRows,
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "ogp_awards.json"),
    JSON.stringify(processed, null, 2)
  );

  console.log(`\n  Total award rows merged: ${allRows.length}`);
  return { file: "ogp_awards.json", status: "ok", total_rows: allRows.length, results };
}

async function fetchETenders() {
  console.log("\n=== eTenders Bulk Dataset ===\n");
  console.log(`Fetching ${ETENDERS_BULK.label}...`);
  console.log("  (Large file — may take 10–20 seconds)");

  try {
    const csv = await fetchCSV(ETENDERS_BULK.url);
    const rows = parseCSV(csv);

    // Save raw
    fs.writeFileSync(path.join(RAW_DIR, "ogp_etenders_bulk_raw.csv"), csv);

    const processed = {
      meta: {
        source: "eTenders / OGP",
        dataset_label: "eTenders Contract Notices — Full Open Dataset",
        license: "CC BY 4.0",
        attribution: "Office of Government Procurement (OGP), Ireland",
        url: "https://etenders.gov.ie",
        fetched_at: new Date().toISOString(),
        pillars: ["procurement_contracts"],
        note: ETENDERS_BULK.note,
        total_rows: rows.length,
      },
      // Store as-is — rows contain awarded values, bid counts, CPV codes
      // Key fields: Tender ID, Contracting Authority, Tender/Contract Name,
      //   Notice Published Date, Competition Type, Main CPV Code Description,
      //   Spend Category, Awarded Value (€), No of Bids Received, Awarded Suppliers
      rows,
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, "ogp_etenders.json"),
      JSON.stringify(processed, null, 2)
    );

    console.log(`  ✓ eTenders bulk: ${rows.length} rows`);
    return { file: "ogp_etenders.json", status: "ok", rows: rows.length };
  } catch (err) {
    console.error(`  ✗ eTenders bulk failed: ${err.message}`);
    return { file: "ogp_etenders.json", status: "error", error: err.message };
  }
}

async function run() {
  [OUTPUT_DIR, RAW_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  console.log("=== OGP Procurement ETL — Ireland Civic Data Project ===\n");

  const awardsResult = await fetchQuarterlyAwards();
  const etendersResult = await fetchETenders();

  const manifest = {
    run_at: new Date().toISOString(),
    source: "OGP Procurement (data.gov.ie / eTenders)",
    datasets: [
      {
        id: "ogp_awards",
        label: "Mini-Competition & Standalone Awards 2023–2024",
        status: awardsResult.status,
        total_rows: awardsResult.total_rows,
        quarterly_breakdown: awardsResult.results,
      },
      {
        id: "ogp_etenders",
        label: "eTenders Bulk Dataset",
        status: etendersResult.status,
        rows: etendersResult.rows,
      },
    ],
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "ogp_manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log("\n=== OGP Procurement ETL Complete ===");
  console.log(`  ogp_awards   → ${awardsResult.total_rows} rows`);
  console.log(`  ogp_etenders → ${etendersResult.rows || "err"} rows`);
}

run().catch(console.error);
