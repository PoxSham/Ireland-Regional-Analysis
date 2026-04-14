'use client';

import Link from 'next/link';
import PageHero from '../../components/ui/PageHero';

export const dynamic = 'force-static';

const C_GREEN = '#0D6B4F';

const DEFINITIONS = [
  {
    term: 'GDP',
    full: 'Gross Domestic Product',
    body: 'The total monetary value of all goods and services produced within Ireland\'s borders in a year, regardless of ownership. In Ireland, GDP is significantly inflated by the activity of multinational corporations — particularly intellectual property transfers, aircraft leasing, and pharmaceutical royalties — making it a poor measure of domestic living standards. Unit: €bn or € per capita, nominal current prices. Source: CSO Annual National Accounts 2024.',
  },
  {
    term: 'GVA',
    full: 'Gross Value Added',
    body: 'The measure of output produced in a region or sector: the value of goods and services produced minus the cost of inputs. The CSO uses GVA rather than GDP for regional accounts (NUTS3 and county). Like national GDP, regional GVA in Dublin and the South-West is inflated by multinational activity. Unit: € per person (nominal, current prices). Source: CSO County Incomes and Regional GDP 2024.',
  },
  {
    term: 'GNI',
    full: 'Gross National Income',
    body: 'GDP plus income received from abroad by Irish residents, minus income sent abroad by foreign entities. In most countries GNI ≈ GDP. In Ireland, due to large cross-border profit flows, GNI is substantially lower than GDP. Note: standard GNI still includes some MNC distortions; GNI* removes additional items. Source: CSO ANA 2024.',
  },
  {
    term: 'GNI*',
    full: 'Modified Gross National Income',
    body: 'Developed by the CSO specifically for Irish conditions. GNI* removes from GNI: (1) depreciation of foreign-owned IP and aircraft assets; (2) undistributed profits of re-domiciled companies; (3) net factor income of SPEs (special purpose entities). GNI* was approximately 57% of GDP in 2024 (€321.1bn). It is Ireland\'s preferred domestic income benchmark and is used by IFAC for fiscal analysis. Unit: €bn / € per capita. Source: CSO Annual National Accounts 2024.',
  },
  {
    term: 'PPS',
    full: 'Purchasing Power Standards',
    body: 'An artificial currency unit developed by Eurostat that removes price level differences between countries, enabling fair cross-national GDP comparison. 1 PPS represents the same purchasing power as €1 across the EU on average. The EU27 average GDP per capita was 38,100 PPS in 2023 (= index 100). Ireland\'s 81,200 PPS = index 213. Note: PPS adjusts for prices but does not remove the structural MNC distortion in Irish accounts. Unit: PPS (€ purchasing-power equivalent). Source: Eurostat.',
  },
  {
    term: 'Modified Domestic Demand (MDD)',
    full: 'Modified Domestic Demand',
    body: 'An Irish-specific aggregate measure of domestic economic activity developed by the CSO. It removes from final domestic demand: aircraft purchases by leasing companies, and R&D spending related to IP imports. MDD growth is the preferred measure of underlying Irish economic momentum. It is less distorted than GDP growth. Source: CSO ANA 2024.',
  },
  {
    term: 'NUTS3',
    full: 'Nomenclature of Territorial Units for Statistics — Level 3',
    body: 'The standard EU subnational statistical geography. Ireland has 7 NUTS3 regions (following 2022 boundary revision): Dublin, Mid-East, South-West, South-East, West, Border, and Midlands. These sit within 3 NUTS2 regions: Eastern & Midland, Southern, and Northern & Western. All regional analysis on this site uses NUTS3 unless explicitly stated. Source: Eurostat / CSO.',
  },
  {
    term: 'Disposable Income',
    full: 'Household Disposable Income per Person',
    body: 'Wages, salaries, and transfer payments received by households, minus income taxes and social contributions. Disposable income is a more meaningful measure of living standards than GVA — it captures what households actually have available to spend or save. Produced at county level by the CSO and aggregated to NUTS3 using population weights. Unit: € per person. Source: CSO County Incomes and Regional GDP 2024, Table 3.1.',
  },
  {
    term: 'Rent-to-Income Ratio',
    full: 'Annual New Tenancy Rent as % of Annual Disposable Income',
    body: 'Calculated as (annual mean new tenancy rent) ÷ (annual disposable income per person). The EU cost-burden threshold is 30%. Dublin at ~77% reflects a structural housing affordability crisis. This measure uses per-person disposable income as the denominator — which may overstate the burden for multi-person rental households. Sources: RTB Rent Index Q2 2024 (rent) · CSO County Incomes 2024 (disposable income).',
  },
];

const CAVEATS = [
  { heading: 'National GVA and GDP', text: 'Ireland\'s national GVA and GDP are significantly inflated by multinational intellectual property transfers and aircraft leasing. Comparisons with other countries using these figures systematically overstate Irish living standards. GNI* is the appropriate domestic benchmark.' },
  { heading: 'Regional GVA distortion', text: 'Dublin and South-West GVA per person are particularly distorted by MNC activity. These regions host the bulk of pharmaceutical, technology, and financial services FDI. GVA in these regions does not represent the income of residents.' },
  { heading: 'PPS estimates for Irish NUTS3', text: 'Only Dublin (139,500 PPS) and South-West (137,300 PPS) are Eurostat-published NUTS3 PPS figures for 2023. PPS values for other Irish NUTS3 regions are derived estimates: CSO GVA 2024 × Ireland PPS/GVA conversion ratio (~0.816). These estimates should be interpreted as indicative, not authoritative.' },
  { heading: 'County-level GVA', text: 'County-level GVA figures are CSO experimental estimates below NUTS3. Some counties have been suppressed for confidentiality. County figures are less reliable than NUTS3 aggregates and should be treated with additional caution.' },
  { heading: 'Regional net migration', text: 'Regional migration flows by NUTS3 are modelled estimates. The CSO publishes national net migration totals; regional splits are derived using historical population share proxies and are not directly measured at NUTS3 level.' },
  { heading: 'NDP regional investment', text: 'National Development Plan regional allocations are modelled estimates. The government does not publish a single official table of per-region capital spending. Figures are derived from sectoral investment envelopes and population proxies.' },
  { heading: 'Population projections', text: 'Regional projections (2022–2042) use the CSO M2F2 scenario (medium fertility, medium migration). Actual outcomes depend on migration policy, economic conditions, and housing supply.' },
  { heading: 'Rent figures', text: 'RTB rent data reflects mean new tenancy rents, not renewal rents. Households in existing tenancies typically pay less. The new-tenancy figure represents the market rate a household faces when moving.' },
];

const SOURCES = [
  { name: 'CSO County Incomes and Regional GDP 2024', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-cirgdp/countyincomesandregionalgdp2024/', table: 'Table 4.1 / 3.1', year: 2024, geography: 'NUTS3 + county', metrics: 'GVA per capita, disposable income' },
  { name: 'CSO Annual National Accounts 2024', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-ana/annualnationalaccounts2024/', table: 'ANA 2024', year: 2024, geography: 'National', metrics: 'GDP, GNI, GNI*, MDD, surplus' },
  { name: 'CSO Government Finance Statistics Oct 2025', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-gfs/governmentfinancestatisticsoctober2025/', table: 'GFS Oct 2025', year: 2024, geography: 'National', metrics: 'Gross debt, net debt, debt/GDP, debt/GNI*' },
  { name: 'CSO Labour Force Survey (LFS) 2024', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-lfs/labourforcesurveyq42024/', table: 'LFS Q4 2024', year: 2024, geography: 'NUTS3', metrics: 'Regional unemployment rates' },
  { name: 'CSO Regional Population Projections 2025', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-rpp/regionalpopulationprojections2025/', table: 'RPP 2025', year: 2025, geography: 'NUTS3', metrics: 'Population projections 2022–2042 (M2F2 scenario)' },
  { name: 'CSO Population and Migration Estimates 2024–2025', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-pme/populationandmigrationestimates2025/', table: 'PME 2024-2025', year: 2024, geography: 'National / modelled regional', metrics: 'Net migration, emigration, immigration' },
  { name: 'CSO Tax Revenue Statistics 2024', url: 'https://www.cso.ie/en/statistics/governmentaccounts/taxrevenue/', table: 'Tax Revenue 2024', year: 2024, geography: 'National', metrics: 'Tax revenue by category, corporation tax' },
  { name: 'CSO Foreign Direct Investment Statistics 2023', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-fdi/foreigndirectinvestment2023/', table: 'FDI 2023', year: 2023, geography: 'NUTS2', metrics: 'Regional FDI shares (NUTS2, not NUTS3)' },
  { name: 'Eurostat NUTS3 GDP per Inhabitant in PPS 2023', url: 'https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251020-1', table: 'nama_10r_3gdp', year: 2023, geography: 'NUTS3', metrics: 'Dublin 139,500 PPS · South-West 137,300 PPS' },
  { name: 'Eurostat National Accounts GDP per Capita (nama_10_pc)', url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=National_accounts_and_GDP', table: 'nama_10_pc', year: 2023, geography: 'EU member states', metrics: 'EU country GDP per capita in PPS' },
  { name: 'Eurostat Unemployment Rate [une_rt_a]', url: 'https://ec.europa.eu/eurostat/databrowser/product/page/UNE_RT_A', table: 'une_rt_a', year: 2024, geography: 'EU member states', metrics: 'EU country annual unemployment rates' },
  { name: 'RTB Rent Index Q2 2024', url: 'https://www.rtb.ie/research/rtb-rent-index/', table: 'RTB Q2 2024', year: 2024, geography: 'Region', metrics: 'Mean new tenancy rents, rent-to-income' },
  { name: 'IFAC Fiscal Assessment Report 2026', url: 'https://www.fiscalcouncil.ie/fiscal-assessment-reports/', table: 'FAR Spring 2026', year: 2026, geography: 'National', metrics: 'CT concentration · fiscal risk assessment' },
  { name: 'Wind Energy Ireland — Annual Statistics 2024', url: 'https://windenergyireland.com/about-wind/facts-stats', table: 'WEI 2024', year: 2024, geography: 'County', metrics: 'Wind capacity MW, generation GWh' },
  { name: 'EirGrid Generation Capacity Report 2024', url: 'https://www.eirgrid.ie/grid/grid-development/generation-capacity', table: 'EirGrid 2024', year: 2024, geography: 'Regional', metrics: 'Grid constraints, curtailment risk' },
  { name: 'National Development Plan 2021–2030', url: 'https://www.gov.ie/en/campaigns/national-development-plan-2021-2030/', table: 'NDP + Budget 2025', year: 2024, geography: 'National / modelled NUTS3', metrics: 'Regional investment envelopes (modelled estimates)' },
];

export default function MethodsSourcesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <PageHero
        badge="Methods & Sources"
        title="Data methods, definitions, and sources"
        takeaway="Every figure on this site comes from an official published source. Where estimates or derived values are used, they are clearly labelled. This page explains the definitions of key terms, the limitations of the data, and the full list of sources."
        lastUpdated="Last reviewed April 2026"
      />

      {/* Definitions */}
      <section id="definitions" style={{ paddingBottom: 56 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916' }}>
            Definitions
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {DEFINITIONS.map(({ term, full, body }) => (
            <div key={term} style={{
              borderTop: '1px solid #EDEAE4', paddingTop: 20, paddingBottom: 20,
              display: 'grid', gridTemplateColumns: 'minmax(120px, 200px) 1fr', gap: 24,
            }}>
              <div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#1A1916', marginBottom: 4 }}>{term}</div>
                <div style={{ fontSize: 11, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{full}</div>
              </div>
              <p style={{ fontSize: 14, color: '#4A4740', lineHeight: 1.72, fontFamily: "'DM Sans', sans-serif" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Caveats */}
      <section id="caveats" style={{ paddingBottom: 56 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916', marginBottom: 12 }}>
            Caveats and limitations
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
            The following caveats apply across the site. They are also noted inline where relevant.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {CAVEATS.map(({ heading, text }) => (
            <div key={heading} style={{
              borderTop: '1px solid #EDEAE4', padding: '18px 0',
              display: 'grid', gridTemplateColumns: 'minmax(120px, 200px) 1fr', gap: 24,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1916', fontFamily: "'DM Sans', sans-serif", paddingTop: 2 }}>
                {heading}
              </div>
              <p style={{ fontSize: 14, color: '#4A4740', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources table */}
      <section id="sources" style={{ paddingBottom: 64 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916', marginBottom: 12 }}>
            All sources
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
            {SOURCES.length} sources referenced across the site. Every data point can be traced to one of these publications.
          </p>
        </div>
        <div style={{
          background: 'white', border: '1px solid #E2DFD8',
          borderRadius: 12, overflow: 'hidden', overflowX: 'auto',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr style={{ background: '#F9F8F4' }}>
                <th style={{ width: '35%' }}>Source</th>
                <th>Year</th>
                <th>Geography</th>
                <th>Metrics used</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map(({ name, url, table, year, geography, metrics }) => (
                <tr key={name}>
                  <td>
                    <a href={url} target="_blank" rel="noopener noreferrer" style={{
                      color: C_GREEN, textDecoration: 'underline',
                      textDecorationColor: '#B8DCCC', textUnderlineOffset: '2px',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                    }}>{name}</a>
                    {table && <div style={{ fontSize: 10, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{table}</div>}
                  </td>
                  <td>{year}</td>
                  <td style={{ fontSize: 12 }}>{geography}</td>
                  <td style={{ fontSize: 11, color: '#6B6860' }}>{metrics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to report errors */}
        <div style={{
          marginTop: 28, background: '#F9F8F4', border: '1px solid #EDEAE4',
          borderRadius: 10, padding: '20px 24px',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1916', marginBottom: 8 }}>
            Found an error?
          </div>
          <p style={{ fontSize: 14, color: '#4A4740', lineHeight: 1.7 }}>
            If you believe a figure on this site is incorrect, mislabelled, or based on a
            superseded source, the data is held in a public GitHub repository. Corrections
            and suggestions are welcome via the repository issues page.
          </p>
        </div>
      </section>
    </div>
  );
}
