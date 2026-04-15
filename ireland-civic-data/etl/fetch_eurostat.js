/**
 * ETL: Eurostat REST API
 * Ireland Civic Data Project
 *
 * Fetches key datasets from the Eurostat API and saves
 * normalised JSON to data/processed/
 *
 * Datasets fetched:
 *   prc_ppp_ind    — AIC, GDP, HFCE per capita in PPS + price level indices (all EU27)
 *   ilc_di03       — Median equivalised disposable income (all EU27)
 *   ilc_li02       — At-risk-of-poverty rate (all EU27)
 *   hlth_sha11_hf  — Health expenditure by financing scheme (gov vs private) — replaces hlth_sha11
 *   hlth_sha11_hc  — Health expenditure by function (hospital, ambulatory, etc.)
 *   nama_10r_3gdp  — Regional GDP NUTS3 (Ireland: IE04x, IE05x, IE06x)
 *
 * NOTE: hlth_sha11 (top-level) returns HTTP 404 — not available for dissemination.
 * Sub-tables hlth_sha11_hf and hlth_sha11_hc ARE available and contain the data we need.
 *
 * Eurostat API docs: https://ec.europa.eu/eurostat/web/api
 * License: CC0 (raw data)
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../data/processed");
const RAW_DIR = path.join(__dirname, "../data/raw");

// Eurostat JSON-stat 2.0 API base
const BASE_URL = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";

const DATASETS = [
  {
    code: "prc_ppp_ind",
    label: "AIC, GDP, HFCE per capita in PPS + price levels",
    params: "?format=JSON&lang=EN",
    pillar: ["ireland_on_paper", "ireland_vs_eu"],
    measure_codes: ["AIC_PC_PPS", "GDP_PC_PPS", "PRICE_LEVEL_INDEX"],
    notes: "Full EU27 — shows Ireland GDP vs AIC gap. Core editorial metric.",
  },
  {
    code: "ilc_di03",
    label: "Median equivalised disposable income",
    params: "?format=JSON&lang=EN",
    pillar: ["ireland_on_paper", "ireland_vs_eu"],
    measure_codes: ["MEDIAN_DISP_INCOME"],
  },
  {
    code: "ilc_li02",
    label: "At-risk-of-poverty rate",
    params: "?format=JSON&lang=EN",
    pillar: ["ireland_on_paper", "ireland_vs_eu"],
    measure_codes: ["POVERTY_RISK_RATE"],
  },
  {
    code: "hlth_sha11_hf",
    label: "Health expenditure by financing scheme (gov vs private)",
    params: "?format=JSON&lang=EN&geo=IE&geo=EU27_2020&geo=DE&geo=FR&geo=NL&geo=AT&geo=BE&geo=DK&geo=FI&geo=SE",
    pillar: ["healthcare", "ireland_vs_eu"],
    measure_codes: ["HEALTH_SPEND_HF"],
    notes: "SHA 2011 financing scheme breakdown — government (HF.1), compulsory (HF.2), voluntary (HF.3). hlth_sha11 top-level not available for dissemination; use sub-tables.",
  },
  {
    code: "hlth_sha11_hc",
    label: "Health expenditure by function (hospital, ambulatory, etc.)",
    params: "?format=JSON&lang=EN&geo=IE&geo=EU27_2020&geo=DE&geo=FR&geo=NL&geo=AT&geo=BE&geo=DK&geo=FI&geo=SE",
    pillar: ["healthcare", "ireland_vs_eu"],
    measure_codes: ["HEALTH_SPEND_HC"],
    notes: "SHA 2011 function breakdown — shows how health money is actually spent (hospitals vs ambulatory vs long-term, etc.).",
  },
  {
    code: "nama_10r_3gdp",
    label: "Regional GDP at NUTS3",
    params: "?format=JSON&lang=EN&geo=IE041&geo=IE042&geo=IE051&geo=IE052&geo=IE053&geo=IE061&geo=IE062&geo=IE063",
    pillar: ["regions"],
    measure_codes: ["GVA_PC"],
    notes: "Ireland NUTS3 regions only",
  },
];

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchJSON(res.headers.location).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          reject(new Error(`JSON parse error: ${e.message} — status ${res.statusCode}`));
        }
      });
    }).on("error", reject);
  });
}

function buildEurostatURL(dataset) {
  return `${BASE_URL}/${dataset.code}${dataset.params}`;
}

function normaliseEurostat(raw, datasetMeta) {
  const body = raw.body;
  const values = body.value || [];
  const dimensions = body.dimension || {};
  const label = body.label || datasetMeta.label;

  return {
    meta: {
      source: "Eurostat",
      dataset_code: datasetMeta.code,
      dataset_label: label,
      license: "CC0 (raw data)",
      attribution: "Eurostat — European Commission",
      url: `https://ec.europa.eu/eurostat/databrowser/view/${datasetMeta.code}`,
      fetched_at: new Date().toISOString(),
      pillars: datasetMeta.pillar,
      measure_codes: datasetMeta.measure_codes,
      notes: datasetMeta.notes || null,
    },
    dimensions: Object.keys(dimensions).reduce((acc, key) => {
      acc[key] = {
        label: dimensions[key].label,
        categories: dimensions[key].category,
      };
      return acc;
    }, {}),
    values,
    raw_size: Array.isArray(values) ? values.length : Object.keys(values).length,
  };
}

async function fetchDataset(dataset) {
  const url = buildEurostatURL(dataset);
  console.log(`Fetching Eurostat ${dataset.code} — ${dataset.label}...`);

  try {
    const raw = await fetchJSON(url);

    if (raw.status !== 200) {
      throw new Error(`HTTP ${raw.status}`);
    }

    // Save raw
    const rawPath = path.join(RAW_DIR, `eurostat_${dataset.code}_raw.json`);
    fs.writeFileSync(rawPath, JSON.stringify(raw.body, null, 2));

    // Normalise and save processed
    const processed = normaliseEurostat(raw, dataset);
    const processedPath = path.join(OUTPUT_DIR, `eurostat_${dataset.code}.json`);
    fs.writeFileSync(processedPath, JSON.stringify(processed, null, 2));

    console.log(`  ✓ ${dataset.code} saved (${processed.raw_size} values)`);
    return { code: dataset.code, status: "ok", values: processed.raw_size };
  } catch (err) {
    console.error(`  ✗ ${dataset.code} failed: ${err.message}`);
    return { code: dataset.code, status: "error", error: err.message };
  }
}

async function run() {
  [OUTPUT_DIR, RAW_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  console.log("=== Eurostat ETL — Ireland Civic Data Project ===\n");
  const results = [];

  for (const dataset of DATASETS) {
    const result = await fetchDataset(dataset);
    results.push(result);
    // Polite delay
    await new Promise((r) => setTimeout(r, 800));
  }

  const manifest = {
    run_at: new Date().toISOString(),
    source: "Eurostat",
    results,
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "eurostat_manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log("\n=== Eurostat ETL Complete ===");
  console.log(results.map((r) => `  ${r.status === "ok" ? "✓" : "✗"} ${r.code}`).join("\n"));
}

run().catch(console.error);
