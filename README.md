# Ireland Civic Data Project

An independent, public-interest Irish civic-data and editorial website that explains where public money comes from, where it goes, who shapes decisions, how outcomes compare with European peers, and how national averages hide regional realities — in clear, sourced, evidence-led language.

> **Formerly:** Irish Regional Economics Dashboard (renamed April 2026 — scope expanded beyond regional analysis)

---

## Mission

Turn fragmented official Irish datasets into a credible, visually strong, editorial-style platform for citizens, journalists, campaigners, and researchers. Transparent sourcing, repeatable methodology, accessible design, and a tone that is sharp and adversarial where warranted but remains evidence-led and legally defensible.

---

## MVP Pillars

| # | Pillar | Description |
|---|---|---|
| 1 | **Ireland on Paper** | Distorted prosperity, GVA/GDP/GNI*, Dublin concentration, why headline figures mislead |
| 2 | **Taxes & Revenue** | Where the State's money comes from, tax composition, volatility, EU context |
| 3 | **Public Spending** | Departmental allocation, current vs capital, trends, per-person breakdown |
| 4 | **Healthcare** | Health spending, system breakdown, regional delivery, outcomes vs spend |
| 5 | **Procurement & Contracts** | Who wins public contracts, in what sectors, through what procedures |
| 6 | **Lobbying & Influence** | SIPO register analysis, key sectors, departments, issues, influence patterns |
| 7 | **Ireland vs EU** | Harmonized comparisons with other member states using consistent datasets |
| 8 | **Regions** | Regional inequality, output, income, infrastructure, access |
| 9 | **Methods & Sources** | Sources, caveats, definitions, matching rules, correction standards |

**Deferred to Phase 2:** Housing & Accommodation · Infrastructure & Capital Delivery · Public Services & Outcomes · Population & Demographic Pressure · NGO/Quango Analysis

---

## Editorial Position

Evidence-led, source-linked, plain-language, public-interest. Not falsely impartial — but every claim is sourced and every comparison is methodologically honest.

**Core macro thesis:** Irish national headline figures are distorted by Dublin concentration and multinational activity. GVA, GDP, and GNI* tell very different stories. The site's job is to explain which numbers mean what, for whom, and why.

---

## Architecture Principles

- Editorial-first, not dashboard-first
- Data must be source-linked, reproducible, and explainable
- Strong claims require stronger sourcing
- Use harmonized EU data for cross-country comparison where possible
- Do not force joins across inconsistent geographies or time periods
- Separate facts, interpretation, and viewpoint clearly
- Build for public readability first, analyst depth second

---

## Technology Stack

- **Framework:** Next.js 15+
- **React:** 18.3+
- **Charts:** Recharts
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Search:** Fuse.js (client-side)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Production build
npm run build
npm start
```

---

## Project Structure

```
├── app/
│   ├── layout.jsx
│   ├── page.jsx
│   ├── globals.css
│   ├── data.js                   # Regional & European data
│   └── components/
│       ├── RegionalChart.jsx
│       ├── TrendChart.jsx
│       ├── EuropeanComparison.jsx
│       ├── MetricCard.jsx
│       └── SearchFilter.jsx
├── package.json
├── tailwind.config.js
├── next.config.js
└── netlify.toml
```

---

## Data Sources

| Source | Used for |
|---|---|
| [CSO County Incomes & Regional GDP 2024](https://www.cso.ie/en/releasesandpublications/ep/p-cirgdp/countyincomesandgdp2024/) | Regional GVA, income, GDP/GNI* |
| [SIPO Register of Lobbying](https://www.lobbying.ie) | Lobbying & Influence pillar |
| [OGP / eTenders](https://www.etenders.gov.ie) | Procurement & Contracts pillar |
| [Eurostat](https://ec.europa.eu/eurostat) | Ireland vs EU harmonized comparisons |
| [Department of Finance / DPER](https://www.gov.ie/en/organisation/department-of-public-expenditure-and-reform/) | Taxes & Spending |

---

## Geography Notes

- Primary regional unit: **CSO NUTS3** classifications
- CSO suppresses individual county data where confidentiality thresholds apply (e.g. Cork/Kerry split — reported as South-West region only)
- "North-West" is not a valid CSO NUTS classification — correct region is **Border** (Cavan, Donegal, Leitrim, Monaghan, Sligo)
- Do not compare NUTS2, NUTS3, and county-level figures in the same chart without explicit caveats

---

## Deployment

Local-first and GitHub-first workflow. Paid hosting deferred until MVP is stable.

```bash
npm run build
```

---

## License

Open source. Data reuse subject to source terms (CSO, Eurostat, SIPO, OGP).

---

**Last Updated:** April 2026 | **Version:** 2.0.0 (Ireland Civic Data Project)
