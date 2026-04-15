# SIPO Lobbying Data — Extraction Plan

## Overview

The Standards in Public Office Commission (SIPO) publishes the Lobbying Register
at [lobbying.ie](https://www.lobbying.ie). There is no bulk API or machine-readable
download endpoint. All data is accessible via HTML pages only.

This document describes the planned extraction approach for Phase 3 / Phase 2 
(Lobbying & Influence pillar).

---

## What Data Is Available

SIPO publishes three record types:

| Type | URL pattern | Contains |
|------|-------------|----------|
| Returns | `/returns` — searchable list | Filer name, period, date filed |
| Return detail | `/returns/{id}` | Lobbied designation, subject matter, activity, proposed outcome |
| Registrants | `/register` | Registered lobbyists (persons and organisations) |

Returns are filed by period (Jan–Apr, May–Aug, Sep–Dec each year). Each return 
links to one or more lobbying activities, each of which names:
- The public official/designated person lobbied (name + role)
- The government body
- The subject matter and specific outcome sought
- Whether communication was direct or indirect

---

## Extraction Approach

### Phase 3 (current) — Baseline only

No automated extraction at this phase. SIPO data is used via the lobbying.ie
search interface only. Manually document key lobbying patterns relevant to:
- Healthcare (e.g. private hospital groups, pharmaceutical companies)
- Public spending / procurement (e.g. accommodation providers relevant to IPAS)
- Housing (developers, REITs)

Save curated notes to `data/curated/sipo_notes.md`.

### Phase 2 — Automated HTML extraction (planned)

Build a rate-limited Node.js script that:

1. **Fetches the returns list** via the search/filter interface:
   ```
   GET https://www.lobbying.ie/register/returns?period=...&pageNo=...
   ```
   Paginate through all results, extract return IDs and metadata.

2. **Fetches each return detail page** (one per return ID):
   ```
   GET https://www.lobbying.ie/returns/{id}
   ```
   Parse the HTML (e.g. with `cheerio`) to extract structured fields.

3. **Rate limiting:** 1 request / 2 seconds minimum. Respect `robots.txt`.
   Cache raw HTML to `data/raw/sipo/` to avoid re-fetching on re-runs.

4. **Output:** Normalised JSON in canonical schema format:
   ```json
   {
     "source": "SIPO lobbying.ie",
     "return_id": "...",
     "filer": "...",
     "period": "...",
     "activities": [...]
   }
   ```

### Entity Linking (Phase 2+, deferred)

Matching lobbyist names to:
- Companies House / CRO records
- OGP contract award data (is this lobbyist also an OGP supplier?)
- Donation records if/when available

Decision: deferred to Phase 2 per the project decision log.

---

## Priority Queries for the Lobbying & Influence Pillar

These are the investigative threads the site will surface:

1. **IPAS accommodation providers** — which private companies lobbied on 
   international protection / asylum / accommodation policy?
2. **Healthcare** — private hospital groups, nursing home chains, pharma companies
3. **Housing / planning** — developer and REIT lobbying on planning rules and rent
4. **Children's Hospital** — any lobbying by contractors or consultants?

---

## Immediate Action (Phase 3)

None — SIPO extraction is a Phase 2 task. This document is preserved here so
the extraction approach is designed and ready when Phase 2 begins.

## Notes

- `robots.txt` at lobbying.ie: check before building the scraper
- No terms of service explicitly prohibiting automated access found as of April 2026
- Site uses server-side rendering — no JavaScript execution required for data pages
- `cheerio` (npm) is sufficient; no headless browser needed

---

*Created: Phase 3, April 2026*
*Status: PLANNED — Phase 2*
