/**
 * ETL: CSO PxStat API
 * Ireland Civic Data Project
 *
 * Fetches key datasets from the CSO PxStat API and saves
 * normalised JSON to data/processed/
 *
 * Datasets fetched:
 *   CIRGDP01 — County GVA per person
 *   CIRGDP03 — Regional GVA and GDP by NUTS
 *   NA001    — Modified GNI* at current prices
 *   NA002    — Modified GNI* at constant prices
 *   UA19     — Unaccompanied minors from Ukraine (Tusla)
 *   UA42     — Persons in Ukraine host accommodation scheme
 *   GFQ01    — General Government transactions (quarterly): revenue, expenditure, deficit
 *   GFA01    — General Government transactions (annual): revenue, expenditure, deficit
 *   GFQ03    — General Government: detailed revenue classification (quarterly)
 *   GFA03    — General Government: detailed revenue classification (annual)
 *   GFQ04    — General Government: detailed expenditure classification (quarterly)
 *   GFA04    — General Government: detailed expenditure classification (annual)
 *
 * CSO API docs: https://data.cso.ie/
 * License: CC BY 4.0 — attribute Central Statistics Office Ireland
 *
 * NOTE: GFQ/GFA tables are ESA 2010 General Government accounts — authoritative
 * source for public revenue and expenditure. Replaces DoF/DPER PDF/XLSX approach:
 * same data, machine-readable, no scraping required.
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../data/processed");
const RAW_DIR = path.join(__dirname, "../data/raw");

const DATASETS = [
  {
    code: "CIRGDP01",
    label: "County GVA per person",
    pillar: ["ireland_on_paper", "regions"],
    measure_codes: ["GVA_PC"],
  },
  {
    code: "CIRGDP03",
    label: "Regional GVA and GDP by NUTS",
    pillar: ["ireland_on_paper", "regions"],
    measure_codes: ["GVA_PC", "GDP_PC_PPS"],
  },
  {
    code: "NA001",
    label: "Modified GNI* at Current Market Prices",
    pillar: ["ireland_on_paper", "ireland_vs_eu"],
    measure_codes: ["GNI_STAR_PC"],
  },
  {
    code: "NA002",
    label: "Modified GNI* at Constant Market Prices",
    pillar: ["ireland_on_paper", "ireland_vs_eu"],
    measure_codes: ["GNI_STAR_PC"],
  },
  {
    code: "UA19",
    label: "Unaccompanied minors from Ukraine referred to Tusla",
    pillar: ["public_spending"],
    measure_codes: ["IPAS_SPEND"],
    notes: "Ukraine accommodation / IPAS context data",
  },
  {
    code: "UA42",
    label: "Persons in accommodation under Ukraine host payment scheme",
    pillar: ["public_spending"],
    measure_codes: ["IPAS_SPEND"],
    notes: "Ukraine Accommodation Recognition Payment data",
  },
  // ── Tier 2: Government Finance (Tax & Public Spending) ─────────────────────
  // These replace the DoF XLSX / DPER PDF approach — same underlying data,
  // machine-readable via CSO PxStat ESA 2010 General Government accounts.
  {
    code: "GFQ01",
    label: "General Government transactions (quarterly) — revenue, expenditure, deficit",
    pillar: ["taxes_revenue", "public_spending"],
    measure_codes: ["GOV_REVENUE", "GOV_EXPENDITURE", "GOV_DEFICIT"],
    notes: "ESA 2010. Top-level quarterly series. Core source for Taxes & Revenue and Public Spending pillars.",
  },
  {
    code: "GFA01",
    label: "General Government transactions (annual) — revenue, expenditure, deficit",
    pillar: ["taxes_revenue", "public_spending"],
    measure_codes: ["GOV_REVENUE", "GOV_EXPENDITURE", "GOV_DEFICIT"],
    notes: "ESA 2010 annual. Longer time series for trend analysis.",
  },
  {
    code: "GFQ03",
    label: "General Government: detailed revenue classification (quarterly)",
    pillar: ["taxes_revenue"],
    measure_codes: ["TAX_BY_TYPE"],
    notes: "Breaks down revenue by tax type — income tax, VAT, corporation tax, excise, etc.",
  },
  {
    code: "GFA03",
    label: "General Government: detailed revenue classification (annual)",
    pillar: ["taxes_revenue"],
    measure_codes: ["TAX_BY_TYPE"],
    notes: "Annual breakdown. Best for long-run tax composition analysis.",
  },
  {
    code: "GFQ04",
    label: "General Government: detailed expenditure classification (quarterly)",
    pillar: ["public_spending"],
    measure_codes: ["SPEND_BY_FUNCTION"],
    notes: "COFOG functional expenditure breakdown — health, education, social protection, etc.",
  },
  {
    code: "GFA04",
    label: "General Government: detailed expenditure classification (annual)",
    pillar: ["public_spending"],
    measure_codes: ["SPEND_BY_FUNCTION"],
    notes: "Annual COFOG. Best for trend and EU comparison of how Ireland spends.",
  },
];

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON parse error for ${url}: ${e.message}`));
        }
      });
    }).on("error", reject);
  });
}

function buildCSO_URL(datasetCode) {
  return `https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/${datasetCode}/JSON-stat/2.0/en`;
}

function normaliseCSO(raw, datasetMeta) {
  // JSON-stat 2.0 structure
  const dataset = raw.dataset || raw;
  const dimensions = dataset.dimension;
  const values = dataset.value;
  const label = dataset.label || datasetMeta.label;

  return {
    meta: {
      source: "CSO PxStat",
      dataset_code: datasetMeta.code,
      dataset_label: label,
      license: "CC BY 4.0",
      attribution: "Central Statistics Office Ireland (CSO)",
      url: `https://data.cso.ie/table/${datasetMeta.code}`,
      fetched_at: new Date().toISOString(),
      pillars: datasetMeta.pillar,
      measure_codes: datasetMeta.measure_codes,
    },
    dimensions: Object.keys(dimensions).reduce((acc, key) => {
      acc[key] = {
        label: dimensions[key].label,
        categories: dimensions[key].category,
      };
      return acc;
    }, {}),
    values,
    raw_size: values ? values.length : 0,
  };
}

async function fetchDataset(dataset) {
  const url = buildCSO_URL(dataset.code);
  console.log(`Fetching CSO ${dataset.code} — ${dataset.label}...`);

  try {
    const raw = await fetchJSON(url);

    // Save raw
    const rawPath = path.join(RAW_DIR, `cso_${dataset.code.toLowerCase()}_raw.json`);
    fs.writeFileSync(rawPath, JSON.stringify(raw, null, 2));

    // Normalise and save processed
    const processed = normaliseCSO(raw, dataset);
    const processedPath = path.join(OUTPUT_DIR, `cso_${dataset.code.toLowerCase()}.json`);
    fs.writeFileSync(processedPath, JSON.stringify(processed, null, 2));

    console.log(`  ✓ ${dataset.code} saved (${processed.raw_size} values)`);
    return { code: dataset.code, status: "ok", values: processed.raw_size };
  } catch (err) {
    console.error(`  ✗ ${dataset.code} failed: ${err.message}`);
    return { code: dataset.code, status: "error", error: err.message };
  }
}

async function run() {
  // Ensure output dirs exist
  [OUTPUT_DIR, RAW_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  console.log("=== CSO ETL — Ireland Civic Data Project ===\n");
  const results = [];

  for (const dataset of DATASETS) {
    const result = await fetchDataset(dataset);
    results.push(result);
    // Polite delay between requests
    await new Promise((r) => setTimeout(r, 500));
  }

  // Write fetch manifest
  const manifest = {
    run_at: new Date().toISOString(),
    source: "CSO PxStat",
    results,
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "cso_manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log("\n=== CSO ETL Complete ===");
  console.log(results.map((r) => `  ${r.status === "ok" ? "✓" : "✗"} ${r.code}`).join("\n"));
}

run().catch(console.error);
