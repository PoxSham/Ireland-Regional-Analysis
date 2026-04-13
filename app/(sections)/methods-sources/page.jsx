'use client';

import PageHero from '../../components/ui/PageHero';
import Callout from '../../components/ui/Callout';

const chartGreen = '#0D6B4F';
const axisColor = '#6B6860';

const DEFINITIONS = [
  {
    term: 'GVA',
    full: 'Gross Value Added',
    body: 'Value of goods and services produced minus the cost of inputs. In Ireland, GVA is used as the regional measure by the CSO. National GVA is distorted by multinational activity — large IP transfers and retained earnings inflate the headline figure. Unit: € per person (nominal, current prices). Source: CSO County Incomes and Regional GDP.',
  },
  {
    term: 'GNI*',
    full: 'Modified Gross National Income',
    body: 'Removes the distorting effects of MNC intellectual property transfers, aircraft leasing depreciation, and retained earnings of redomiciled companies. GNI* was approximately 57% of GDP in 2024, reflecting the scale of distortion in Irish national accounts. Unit: €bn total / € per capita. Source: CSO Annual National Accounts 2024.',
  },
  {
    term: 'PPS',
    full: 'Purchasing Power Standards',
    body: 'An artificial currency unit developed by Eurostat that removes price level differences between countries, enabling fair cross-national comparison. The EU27 average equals 38,100 PPS in 2023. Used in all Eurostat cross-country GDP and income comparisons. Unit: PPS (€ purchasing-power equivalent). Source: Eurostat.',
  },
  {
    term: 'NUTS3',
    full: 'Nomenclature of Territorial Units for Statistics — Level 3',
    body: 'The standard EU statistical geography for subnational analysis. Ireland has 7 NUTS3 regions: Dublin, Mid-East, South-West, South-East, West, Border, and Midlands. NUTS3 is used for all regional breakdowns on this site unless otherwise stated. Source: Eurostat / CSO.',
  },
  {
    term: 'Disposable Income',
    full: 'Household Disposable Income per Person',
    body: 'Wages and transfer payments received, minus income taxes and social contributions. A more realistic measure of living standards than GVA, which is a production-side measure. Disposable income captures what households actually have available to spend or save. Unit: € per person. Source: CSO County Incomes and Regional GDP 2024.',
  },
  {
    term: 'Rent-to-Income Ratio',
    full: 'Annual Rent as % of Annual Disposable Income',
    body: 'Calculated as (annual new tenancy rent) ÷ (annual disposable income). A household spending more than 30% of income on rent is considered cost-burdened. Dublin at approximately 77% is extreme by EU standards and reflects a structural housing affordability crisis rather than a cyclical spike. Source: RTB Rent Index Q2 2024; CSO County Incomes 2024.',
  },
];

const CAVEATS = [
  'GVA figures for Irish NUTS3 regions are distorted by multinational activity, particularly in Dublin and the South-West (where significant IP and pharmaceutical production is booked). Comparisons with other EU regions must account for this.',
  'Net migration by NUTS3 region is a modelled estimate. The CSO publishes national net migration totals; regional splits are derived using historical population share proxies and are not directly measured.',
  'NDP investment allocations by NUTS3 are modelled estimates. The government does not publish a single official table of per-region capital spending. Figures are derived from sectoral envelopes and population proxies.',
  'PPS values for Irish NUTS3 regions other than Dublin and the South-West are derived estimates. Only Dublin (139,500 PPS) and South-West (137,300 PPS) are Eurostat-published NUTS3 figures for 2023.',
  'Disposable income figures are produced at county level by the CSO and aggregated to NUTS3 using population weights. Some county figures are subject to revision.',
  'Population projections (2022–2042) use the CSO M2F2 scenario (medium fertility, medium migration). Actual outcomes depend heavily on future migration policy and economic conditions.',
];

const SOURCES = [
  { name: 'CSO County Incomes and Regional GDP 2024', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-cirgdp/countyincomesandregionalgdp2024/', table: 'Table 4.1 / 4.4', year: 2024, geography: 'NUTS3 + county', metrics: 'GVA per capita, county GVA' },
  { name: 'Eurostat NUTS3 GDP per inhabitant in PPS 2023', url: 'https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251020-1', table: 'nama_10r_3gdp', year: 2023, geography: 'NUTS3', metrics: 'Dublin 139,500 PPS; South-West 137,300 PPS' },
  { name: 'Eurostat National Accounts GDP per capita (nama_10_pc)', url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=National_accounts_and_GDP', table: 'nama_10_pc', year: 2023, geography: 'EU member states', metrics: 'EU country PPS values' },
  { name: 'Eurostat Unemployment Rate [une_rt_a]', url: 'https://ec.europa.eu/eurostat/databrowser/product/page/UNE_RT_A', table: 'une_rt_a', year: 2024, geography: 'EU member states', metrics: 'EU country unemployment' },
  { name: 'CSO Labour Force Survey (LFS) 2024', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-lfs/labourforcesurveyq42024/', table: 'LFS Q4 2024', year: 2024, geography: 'NUTS3', metrics: 'Regional unemployment rates' },
  { name: 'CSO County Incomes — Disposable Income 2024', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-cirgdp/countyincomesandregionalgdp2024/', table: 'Table 3.1', year: 2024, geography: 'NUTS3', metrics: 'Disposable income per person' },
  { name: 'RTB Rent Index Q2 2024', url: 'https://www.rtb.ie/research/rtb-rent-index/', table: 'RTB Q2 2024', year: 2024, geography: 'Region', metrics: 'Mean new tenancy rents, rent-to-income' },
  { name: 'CSO Annual National Accounts (ANA) 2024', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-ana/annualnationalaccounts2024/', table: 'ANA 2024', year: 2024, geography: 'National', metrics: 'GDP, GNI*, GNI, MDD, surplus' },
  { name: 'CSO Government Finance Statistics 2024', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-gfs/governmentfinancestatisticsoctober2025/', table: 'GFS Oct 2025', year: 2024, geography: 'National', metrics: 'Gross debt, net debt, debt/GDP, debt/GNI*' },
  { name: 'CSO Tax Revenue Statistics 2024', url: 'https://www.cso.ie/en/statistics/governmentaccounts/taxrevenue/', table: 'Tax Revenue 2024', year: 2024, geography: 'National', metrics: 'Tax revenue by category, CT concentration' },
  { name: 'IFAC Fiscal Assessment Report 2026', url: 'https://www.fiscalcouncil.ie/fiscal-assessment-reports/', table: 'FAR Spring 2026', year: 2026, geography: 'National', metrics: 'CT concentration (3 companies = 46%)' },
  { name: 'Wind Energy Ireland — Annual Statistics 2024', url: 'https://windenergyireland.com/about-wind/facts-stats', table: 'WEI 2024', year: 2024, geography: 'County', metrics: 'Wind capacity, generation, targets' },
  { name: 'EirGrid Generation Capacity Report 2024', url: 'https://www.eirgrid.ie/grid/grid-development/generation-capacity', table: 'EirGrid 2024', year: 2024, geography: 'Regional', metrics: 'Grid constraints, curtailment risk' },
  { name: 'CSO Regional Population Projections 2025', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-rpp/regionalpopulationprojections2025/', table: 'RPP 2025', year: 2025, geography: 'NUTS3', metrics: 'Population projections 2022–2042 (M2F2)' },
  { name: 'CSO Population and Migration Estimates 2024–2025', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-pme/populationandmigrationestimates2025/', table: 'PME 2024-2025', year: 2024, geography: 'National / modelled regional', metrics: 'Net migration, emigration, immigration' },
  { name: 'CSO Foreign Direct Investment Statistics 2023', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-fdi/foreigndirectinvestment2023/', table: 'FDI 2023', year: 2023, geography: 'NUTS2', metrics: 'Regional FDI shares' },
  { name: 'National Development Plan 2021–2030', url: 'https://www.gov.ie/en/campaigns/national-development-plan-2021-2030/', table: 'NDP + Budget 2025', year: 2024, geography: 'NUTS3 (estimated)', metrics: 'Regional investment allocations (modelled)' },
];

export default function MethodsSourcesPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
      <PageHero
        badge="Methods & Sources"
        title="Data Methods, Definitions, and Sources"
        takeaway="This site uses CSO, Eurostat, and agency data. Every figure has a source, year, geography, and definition. Where estimates are used, they are clearly labelled."
        lastUpdated="Last reviewed June 2025"
      />

      {/* Key Definitions */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>Key Definitions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginBottom: 40 }}>
        {DEFINITIONS.map(def => (
          <div
            key={def.term}
            style={{
              background: 'white',
              border: '1px solid #E2DFD8',
              borderRadius: 8,
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: chartGreen, fontFamily: 'monospace', background: '#F0FAF5', padding: '1px 7px', borderRadius: 4 }}>{def.term}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{def.full}</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#444', lineHeight: 1.65 }}>{def.body}</p>
          </div>
        ))}
      </div>

      {/* Data Caveats */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>Data Caveats</h2>
      <div style={{ marginBottom: 40 }}>
        <Callout variant="warning">
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
            {CAVEATS.map((c, i) => (
              <li key={i} style={{ fontSize: 13, color: '#78350F' }}>{c}</li>
            ))}
          </ul>
        </Callout>
      </div>

      {/* Sources Registry */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: '0 0 16px' }}>Sources Registry</h2>
      <div style={{ overflowX: 'auto', marginBottom: 40 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2DFD8' }}>
              {['#', 'Source', 'Year', 'Geography', 'Metrics Covered'].map(h => (
                <th
                  key={h}
                  style={{ textAlign: 'left', padding: '8px 12px', color: axisColor, fontWeight: 600, whiteSpace: 'nowrap', background: '#FAFAF9' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SOURCES.map((s, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F0EDE8', background: i % 2 === 0 ? 'white' : '#FAFAF9' }}>
                <td style={{ padding: '9px 12px', color: axisColor, fontVariantNumeric: 'tabular-nums', width: 28 }}>{i + 1}</td>
                <td style={{ padding: '9px 12px', minWidth: 240 }}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: chartGreen, textDecoration: 'none', fontWeight: 500 }}
                  >
                    {s.name}
                  </a>
                  <div style={{ fontSize: 11, color: axisColor, marginTop: 1 }}>{s.table}</div>
                </td>
                <td style={{ padding: '9px 12px', color: '#333', whiteSpace: 'nowrap' }}>{s.year}</td>
                <td style={{ padding: '9px 12px', color: '#333', whiteSpace: 'nowrap' }}>{s.geography}</td>
                <td style={{ padding: '9px 12px', color: '#333' }}>{s.metrics}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
