'use client';

export default function MethodsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div className="mb-8">
        <h2 style={{ fontSize: 28, marginBottom: 8 }}>Methods and Data Sources</h2>
        <p style={{ color: '#6B6860', fontSize: 15, maxWidth: 800, lineHeight: 1.6 }}>
          This analysis draws on publicly available CSO, Eurostat, and government data. Key terms and definitions are clarified below to ensure metrics are not conflated.
        </p>
      </div>

      {/* Definitions */}
      <div className="card" style={{ padding: '28px 28px 24px' }}>
        <h3 style={{ fontSize: 18, marginBottom: 16 }}>Definitions</h3>
        <dl style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            {
              term: 'GVA per person (Gross Value Added)',
              def: 'Total value of goods and services produced within a region, divided by population, before taxes and subsidies on products. CSO publishes this at basic prices for NUTS3 regions and counties. Primary regional output measure used in this analysis.',
            },
            {
              term: 'GDP per person (Gross Domestic Product)',
              def: "GVA plus taxes minus subsidies on products. Ireland's GDP is significantly inflated by multinational profit-booking and IP transfers. The CSO advises against using Irish GDP for international comparisons.",
            },
            {
              term: 'GNI* (Modified Gross National Income)',
              def: 'Developed by the CSO specifically to remove MNC distortions. Excludes IP depreciation, leased aircraft depreciation, and redomiciled PLC income. Stood at €321.1bn in 2024.',
            },
            {
              term: 'Disposable Income per person',
              def: 'Household income after taxes and transfers, divided by population. CSO county-level data; less granular than GVA data.',
            },
            {
              term: 'Unemployment rate',
              def: '% of labour force actively seeking work. Source: CSO Labour Force Survey.',
            },
            {
              term: 'Infrastructure Score',
              def: 'NOT shown in this analysis. An infrastructure composite score was previously calculated for this site but the methodology, weights, and source data have not been formally published. It has been removed until a peer-reviewed methodology is available.',
            },
          ].map(d => (
            <div key={d.term}>
              <dt style={{ fontWeight: 600, fontSize: 14, color: '#1A1916', marginBottom: 4 }}>{d.term}</dt>
              <dd style={{ fontSize: 14, color: '#6B6860', lineHeight: 1.6, paddingLeft: 0 }}>{d.def}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Sources table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 28px 8px' }}>
          <h3 style={{ fontSize: 18 }}>Data Sources</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2DFD8', background: '#F9F8F4' }}>
                <th style={{ padding: '10px 20px', textAlign: 'left', color: '#6B6860' }}>Dataset</th>
                <th style={{ padding: '10px 20px', textAlign: 'left', color: '#6B6860' }}>Source</th>
                <th style={{ padding: '10px 20px', textAlign: 'left', color: '#6B6860' }}>Geography</th>
                <th style={{ padding: '10px 20px', textAlign: 'left', color: '#6B6860' }}>Year</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['GVA per person by county/region', 'CSO County Incomes and GDP 2024', 'County + NUTS3', '2024 (preliminary)'],
                ['National Accounts (GDP, GNI*)', 'CSO Annual National Accounts 2024', 'National', '2024'],
                ['Tax revenue', 'CSO Ireland\'s Tax Statistics 2024', 'National', '2024'],
                ['Government expenditure', 'whereyourmoneygoes.gov.ie', 'National', '2024'],
                ['National Debt', 'CSO Government Finance Statistics 2024', 'National', '2024'],
                ['Corporation Tax concentration', 'Irish Fiscal Advisory Council', 'National', 'Feb 2026'],
                ['Population projections', 'CSO Regional Projections Jan 2025', 'NUTS3', '2022–2042'],
                ['Rent data', 'Residential Tenancies Board Q2 2024', 'Regional', '2024'],
                ['Wind energy', 'Wind Energy Ireland 2024', 'County', '2024'],
                ['EU comparisons', 'Eurostat Regional Statistics', 'NUTS2', '2022–2023'],
              ].map(([dataset, source, geo, year], i) => (
                <tr key={i} style={{ borderBottom: '1px solid #EDEAE4' }}>
                  <td style={{ padding: '10px 20px', fontWeight: 500 }}>{dataset}</td>
                  <td style={{ padding: '10px 20px', color: '#6B6860' }}>{source}</td>
                  <td style={{ padding: '10px 20px', color: '#6B6860' }}>{geo}</td>
                  <td style={{ padding: '10px 20px', color: '#6B6860' }}>{year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Composition note */}
      <div className="card" style={{ padding: '20px 28px' }}>
        <h3 style={{ fontSize: 18, marginBottom: 12 }}>Notes on Region Groupings</h3>
        <p style={{ fontSize: 14, color: '#6B6860', lineHeight: 1.6 }}>
          Region groupings in this analysis follow CSO NUTS3 2016 definitions. Where custom groupings are used, they are clearly labelled. The Mid-West NUTS3 region (Clare, Limerick, North Tipperary) has limited data coverage in this analysis — users requiring Mid-West data should consult CSO directly.
        </p>
      </div>
    </div>
  );
}
