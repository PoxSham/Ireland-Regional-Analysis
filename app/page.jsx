'use client';

import { useState, lazy, Suspense } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell, ReferenceLine,
} from 'recharts';
import {
  irishRegions, europeanCountries, euAverages, irelandNational, countyData,
  macroIndicators, costOfLivingData, taxRevenue, govSpending, nationalDebt,
  renewableData, nationalWindStats, migrationData, fdiData,
  populationProjections, investmentGapData,
} from './data';
import ScatterPlot from './components/ScatterPlot';

const MethodsPage = lazy(() => import('./components/MethodsPage'));

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'output', label: 'Regional Output' },
  { id: 'household', label: 'Household Income' },
  { id: 'fiscal', label: 'Fiscal Picture' },
  { id: 'energy', label: 'Renewable Energy' },
  { id: 'population', label: 'Population' },
  { id: 'europe', label: 'Ireland & Europe' },
  { id: 'policy', label: 'Policy & Investment' },
  { id: 'methods', label: 'Methods & Sources' },
];

const chartGreen = '#0D6B4F';
const chartGreenLight = '#8BAF9E';
const chartGrey = '#C5CCC9';
const axisColor = '#6B6860';
const gridColor = '#F0EDE8';

function SectionTitle({ children, finding }) {
  return (
    <div className="mb-8">
      <h2 style={{ fontSize: 28, marginBottom: 8 }}>{children}</h2>
      {finding && <p style={{ color: '#6B6860', fontSize: 15, maxWidth: 800, lineHeight: 1.6 }}>{finding}</p>}
    </div>
  );
}

function ChartPanel({ title, children, source, whatThisMeans }) {
  return (
    <div className="card" style={{ padding: '28px 28px 20px' }}>
      {title && <h3 style={{ fontSize: 18, marginBottom: 16 }}>{title}</h3>}
      {children}
      {source && <p className="source-note">{source}</p>}
      {whatThisMeans && (
        <div style={{ marginTop: 16, padding: '16px 20px', background: '#F9F8F4', borderRadius: 8, border: '1px solid #EDEAE4' }}>
          <p style={{ fontSize: 14, color: '#6B6860', lineHeight: 1.65, fontStyle: 'italic' }}>{whatThisMeans}</p>
        </div>
      )}
    </div>
  );
}

function KPICard({ label, value, sub }) {
  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      <div style={{ fontSize: 12, color: '#A8A69F', marginBottom: 4, fontFamily: "'DM Sans', system-ui, sans-serif" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#0D6B4F', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#A8A69F', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function ChartTooltip({ active, payload, label, prefix = '€', suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1A1916', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || '#0D6B4F' }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}
        </div>
      ))}
    </div>
  );
}

// SVG Logo — abstract harp mark
function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="#0D6B4F" strokeWidth="2" fill="none" />
      <line x1="16" y1="6" x2="16" y2="26" stroke="#0D6B4F" strokeWidth="1.5" />
      <path d="M12 10 Q16 4 20 10" stroke="#0D6B4F" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="12" x2="12" y2="24" stroke="#0D6B4F" strokeWidth="1" opacity="0.5" />
      <line x1="20" y1="12" x2="20" y2="24" stroke="#0D6B4F" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [countyView, setCountyView] = useState(false);

  // ── Data preparation ──────────────────────────────────────────
  const regionGvaData = irishRegions
    .map(r => ({ name: r.shortName, gva: r.gva[2024], color: r.color }))
    .sort((a, b) => b.gva - a.gva);

  const countyGvaData = [...countyData]
    .sort((a, b) => b.gva - a.gva);

  const gdpPopData = irishRegions.map(r => ({
    name: r.shortName,
    'GDP Share %': r.gdpShare,
    'Population Share %': Math.round(r.population / 54000),
  }));

  const dublinTrend = Object.entries(irishRegions.find(r => r.id === 'dublin').gva).map(([y, v]) => ({
    year: +y, Dublin: v, Border: irishRegions.find(r => r.id === 'northwest').gva[+y],
  }));

  const rentIncomeData = [...costOfLivingData].sort((a, b) => b.rentToIncome - a.rentToIncome);

  const unemploymentData = irishRegions
    .map(r => ({ name: r.shortName, rate: r.unemployment[2024] }))
    .sort((a, b) => b.rate - a.rate);

  const incomeRentData = irishRegions.map(r => ({
    name: r.shortName,
    'Disposable Income': r.disposable[2024],
    'Annual Rent': r.rent * 12,
  }));

  const taxData = [...taxRevenue.breakdown2024].sort((a, b) => b.amount - a.amount);
  const spendData = [...govSpending.breakdown2024].sort((a, b) => b.amount - a.amount);

  const debtYears = Object.keys(nationalDebt.history.gdpPct).map(Number);
  const debtLineData = debtYears.map(y => ({
    year: y,
    'Debt/GDP %': nationalDebt.history.gdpPct[y],
    'Debt/GNI* %': nationalDebt.history.gniPct[y],
  }));

  const euBarData = europeanCountries
    .filter(c => c.category !== 'ireland')
    .concat([{ name: 'Ireland', gvaPerCapita: irelandNational.gvaPerCapita, category: 'ireland' }])
    .sort((a, b) => b.gvaPerCapita - a.gvaPerCapita);

  // Real purchasing power data
  const purchasingPowerData = [...costOfLivingData]
    .map(d => ({
      name: d.name,
      'Disposable Income': d.disposable,
      'After Rent': d.realPurchasing,
      id: d.id,
    }))
    .sort((a, b) => b['After Rent'] - a['After Rent']);

  // Renewable energy data
  const windCapacityData = [...renewableData]
    .filter(r => r.capacity > 0)
    .sort((a, b) => b.capacity - a.capacity);

  // Migration bar data
  const migrationBarData = migrationData.regions
    .map(r => ({ name: r.name, 'Net Migration': r.netFlow, retention: r.youngWorkerRetention }))
    .sort((a, b) => b['Net Migration'] - a['Net Migration']);

  // Population projections line data (already flat)
  const popLineData = populationProjections;

  // Investment gap data
  const investmentBarData = [...investmentGapData].sort((a, b) => b.perCapita - a.perCapita);

  return (
    <div style={{ minHeight: '100vh', background: '#F5F4F0' }}>
      {/* ── Sticky Nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'white', borderBottom: '1px solid #E2DFD8' }}>
        {/* Row 1: Logo / title */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0 10px' }}>
            <Logo />
            <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: '#1A1916' }}>Irish Regional Economics</span>
          </div>
        </div>
        {/* Row 2: Tab strip — full width, scrollable, fades at edges on mobile */}
        <div style={{ borderTop: '1px solid #F0EDE8', position: 'relative' }}>
          <div
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              paddingLeft: 20,
              display: 'flex',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  padding: '10px 14px',
                  fontSize: 13,
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: activeSection === s.id ? 600 : 400,
                  color: activeSection === s.id ? '#0D6B4F' : '#6B6860',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeSection === s.id ? '2px solid #0D6B4F' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          {/* Fade hint on right edge to signal scrollability */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 40, height: '100%',
            background: 'linear-gradient(to right, transparent, white)',
            pointerEvents: 'none',
          }} />
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ════════════════ SECTION 1: OVERVIEW ════════════════ */}
        {activeSection === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <SectionTitle finding="Ireland's national GVA per person (€99,513) is among the highest in Europe, but this masks a 5.6-fold gap between Dublin and the Border region. National income figures are further inflated by multinational activity — GNI*, a more realistic measure of domestic income, stands at €321bn, or 57% of GDP.">
              Ireland&apos;s Regional Economy in 2024
            </SectionTitle>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <KPICard label="National GVA per person" value="€99,513" sub="Source: CSO 2024" />
              <KPICard label="GNI* (true domestic income)" value="€321.1bn" sub="Source: CSO ANA 2024" />
              <KPICard label="National unemployment" value="4.5%" sub="Source: CSO 2024" />
              <KPICard label="Regional disparity (Dublin÷Border)" value="5.6×" sub="Calculated from CSO NUTS3 data" />
            </div>

            <ChartPanel
              title="GVA per Person by NUTS3 Region, 2024"
              source="Source: CSO County Incomes and GDP 2024, Table 4.1"
              whatThisMeans="Dublin's GVA per person (€173,586) is more than double the national average and over five times that of the Border region (€31,057). This gap has widened since 2015, driven by Dublin's concentration of high-value multinational activity. Regions outside Leinster have seen slower growth and increasing brain drain."
            >
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={regionGvaData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={100} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine x={irelandNational.gvaPerCapita} stroke={chartGreenLight} strokeDasharray="6 4" label={{ value: 'National avg', position: 'top', fontSize: 10, fill: axisColor }} />
                  <Bar dataKey="gva" radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: v => `€${v.toLocaleString()}`, fontSize: 11, fill: axisColor }}>
                    {regionGvaData.map((d, i) => (
                      <Cell key={i} fill={d.gva >= irelandNational.gvaPerCapita ? chartGreen : chartGreenLight} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel
              title="GVA per Person Divergence: Dublin vs Border, 2015–2024"
              source="Source: CSO County Incomes and GDP, various years"
            >
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dublinTrend} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: axisColor }} />
                  <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: "'DM Sans', system-ui, sans-serif" }} />
                  <Line type="monotone" dataKey="Dublin" stroke={chartGreen} strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Border" stroke={chartGrey} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>
          </div>
        )}

        {/* ════════════════ SECTION 2: REGIONAL OUTPUT ════════════════ */}
        {activeSection === 'output' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <SectionTitle finding="Six of Ireland's eight NUTS3 regions produce GVA per person below the national average. Dublin and South-West account for the majority of national output, while the Border and Midlands regions lag significantly.">
              Where Output Is Concentrated
            </SectionTitle>

            {/* County / Region toggle */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setCountyView(false)}
                style={{
                  padding: '8px 18px', fontSize: 13, borderRadius: 8, cursor: 'pointer',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  background: !countyView ? '#0D6B4F' : 'white',
                  color: !countyView ? 'white' : '#6B6860',
                  border: !countyView ? '1px solid #0D6B4F' : '1px solid #E2DFD8',
                  fontWeight: !countyView ? 600 : 400,
                }}
              >
                By Region
              </button>
              <button
                onClick={() => setCountyView(true)}
                style={{
                  padding: '8px 18px', fontSize: 13, borderRadius: 8, cursor: 'pointer',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  background: countyView ? '#0D6B4F' : 'white',
                  color: countyView ? 'white' : '#6B6860',
                  border: countyView ? '1px solid #0D6B4F' : '1px solid #E2DFD8',
                  fontWeight: countyView ? 600 : 400,
                }}
              >
                By County
              </button>
            </div>

            {!countyView ? (
              <ChartPanel
                title="GVA per Person by NUTS3 Region, 2024"
                source="Source: CSO County Incomes and GDP 2024, Table 4.1"
              >
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={regionGvaData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                    <CartesianGrid stroke={gridColor} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={100} />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine x={irelandNational.gvaPerCapita} stroke={chartGreenLight} strokeDasharray="6 4" label={{ value: 'National avg €99,513', position: 'top', fontSize: 10, fill: axisColor }} />
                    <Bar dataKey="gva" radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: v => `€${v.toLocaleString()}`, fontSize: 11, fill: axisColor }}>
                      {regionGvaData.map((d, i) => (
                        <Cell key={i} fill={d.gva >= irelandNational.gvaPerCapita ? chartGreen : chartGreenLight} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartPanel>
            ) : (
              <ChartPanel
                title="GVA per Person by County, 2024 (CSO Table 4.1)"
                source="Source: CSO County Incomes and GDP 2024. Note: Cork and Kerry GVA figures are combined as 'South-West' — CSO suppresses individual county figures for confidentiality reasons."
              >
                <ResponsiveContainer width="100%" height={Math.max(400, countyGvaData.length * 28)}>
                  <BarChart data={countyGvaData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                    <CartesianGrid stroke={gridColor} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={160} />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine x={irelandNational.gvaPerCapita} stroke={chartGreenLight} strokeDasharray="6 4" label={{ value: 'National avg €99,513', position: 'top', fontSize: 10, fill: axisColor }} />
                    <Bar dataKey="gva" radius={[0, 4, 4, 0]}>
                      {countyGvaData.map((d, i) => (
                        <Cell key={i} fill={d.gva >= irelandNational.gvaPerCapita ? chartGreen : chartGreenLight} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartPanel>
            )}

            <ChartPanel
              title="GDP Share vs Population Share by Region"
              source="Source: CSO Regional GDP 2024; CSO Census 2022"
              whatThisMeans="Dublin contributes 41% of national GDP while housing 23% of the population. The Border region, with 4% of population, generates just 2% of national output. FDI is highly concentrated in the Eastern & Midland NUTS2 region (71% of investment value), reinforcing existing disparities."
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gdpPopData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                  <CartesianGrid stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<ChartTooltip prefix="" suffix="%" />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: "'DM Sans', system-ui, sans-serif" }} />
                  <Bar dataKey="GDP Share %" fill={chartGreen} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Population Share %" fill={chartGrey} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            {/* Infrastructure: Qualitative Regional Assessment */}
            <div className="card" style={{ padding: '24px 28px' }}>
              <h3 style={{ fontSize: 18, marginBottom: 4 }}>Infrastructure Constraints by Category</h3>
              <p style={{ fontSize: 13, color: '#6B6860', marginBottom: 16, lineHeight: 1.6 }}>Based on published reports from EirGrid, Uisce Éireann, EPA, and ComReg. Constraint levels are qualitative assessments derived from agency commentary — not composite scores.</p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ fontSize: 13, width: '100%' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E2DFD8', background: '#F9F8F4' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#6B6860' }}>Region</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#6B6860' }}>Grid (EirGrid)</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#6B6860' }}>Water (Uisce Éireann)</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#6B6860' }}>Broadband (ComReg)</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#6B6860' }}>Key Constraint</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Dublin', grid: 'Adequate', water: 'Adequate', broadband: 'High coverage', constraint: 'Housing capacity, transport saturation' },
                      { name: 'South-West', grid: 'Constrained', water: 'Moderate', broadband: 'Good', constraint: 'Water supply, grid investment needed' },
                      { name: 'Mid-East', grid: 'Constrained', water: 'Critical', broadband: 'Good', constraint: 'Water capacity critical, grid investment' },
                      { name: 'South-East', grid: 'Constrained', water: 'Moderate', broadband: 'Moderate', constraint: 'Port infrastructure, grid capacity' },
                      { name: 'West', grid: 'Severely constrained', water: 'Moderate', broadband: 'Below avg', constraint: 'Grid severely constrained, roads, broadband' },
                      { name: 'Border', grid: 'Severely constrained', water: 'Poor', broadband: 'Below avg', constraint: 'Grid transmission, wastewater, peripherality' },
                      { name: 'Midlands', grid: 'Constrained', water: 'Poor', broadband: 'Below avg', constraint: 'Manufacturing decline, grid access' },
                    ].map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #EDEAE4' }}>
                        <td style={{ padding: '10px 16px', fontWeight: 500 }}>{r.name}</td>
                        <td style={{ padding: '10px 16px', color: r.grid.includes('Severely') ? '#DC2626' : r.grid === 'Constrained' ? '#D97706' : '#0D6B4F' }}>{r.grid}</td>
                        <td style={{ padding: '10px 16px', color: r.water === 'Critical' || r.water === 'Poor' ? '#DC2626' : r.water === 'Moderate' ? '#D97706' : '#0D6B4F' }}>{r.water}</td>
                        <td style={{ padding: '10px 16px', color: r.broadband.includes('Below') ? '#D97706' : '#0D6B4F' }}>{r.broadband}</td>
                        <td style={{ padding: '10px 16px', color: '#6B6860', fontSize: 12 }}>{r.constraint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="source-note" style={{ marginTop: 12 }}>Sources: EirGrid Transmission Development Plan 2025–2034; Uisce Éireann Performance Report 2024; ComReg Quarterly Key Data Report Q3 2024; EPA Environmental Indicators 2024</p>
            </div>

            {/* County table */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '20px 28px 8px' }}>
                <h3 style={{ fontSize: 18 }}>County GVA Data</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E2DFD8', background: '#F9F8F4' }}>
                      <th style={{ padding: '10px 20px', textAlign: 'left', color: '#6B6860' }}>County / Region</th>
                      <th style={{ padding: '10px 20px', textAlign: 'right', color: '#6B6860' }}>GVA per Person</th>
                      <th style={{ padding: '10px 20px', textAlign: 'right', color: '#6B6860' }}>vs National Avg</th>
                      <th style={{ padding: '10px 20px', textAlign: 'left', color: '#6B6860' }}>NUTS3 Region</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countyGvaData.map((c, i) => {
                      const diff = ((c.gva / irelandNational.gvaPerCapita - 1) * 100).toFixed(0);
                      // Counties with CSO-suppressed data (confidentiality) — values are estimates
                      const suppressed = ['Mayo', 'Roscommon', 'Donegal', 'Leitrim', 'Tipperary'];
                      const isEstimated = suppressed.includes(c.name);
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #EDEAE4' }}>
                          <td style={{ padding: '10px 20px', fontWeight: 500 }}>
                            {c.name}{isEstimated && <span style={{ fontSize: 11, color: '#A8A69F', marginLeft: 4 }}>est.</span>}
                          </td>
                          <td style={{ padding: '10px 20px', textAlign: 'right' }}>€{c.gva.toLocaleString()}</td>
                          <td style={{ padding: '10px 20px', textAlign: 'right', color: diff >= 0 ? '#0D6B4F' : '#A8A69F' }}>
                            {diff >= 0 ? '+' : ''}{diff}%
                          </td>
                          <td style={{ padding: '10px 20px', color: '#6B6860' }}>{c.region}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="source-note" style={{ padding: '12px 28px' }}>Source: CSO County Incomes and GDP 2024, Table 4.1</p>
            </div>
          </div>
        )}

        {/* ════════════════ SECTION 3: HOUSEHOLD INCOME ════════════════ */}
        {activeSection === 'household' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <SectionTitle finding="Disposable income per person is more evenly distributed than output, but rent burden erases much of Dublin's income advantage. After housing costs, the West and South-East offer better real purchasing power than the capital.">
              Household Income and the Cost of Living
            </SectionTitle>

            <ChartPanel
              title="Annual Disposable Income vs Annual Rent by Region, 2024"
              source="Source: CSO disposable income 2024; RTB Q2 2024"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeRentData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                  <CartesianGrid stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: "'DM Sans', system-ui, sans-serif" }} />
                  <Bar dataKey="Disposable Income" fill={chartGreen} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Annual Rent" fill="#C5CCC9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            {/* Real Purchasing Power chart */}
            <ChartPanel
              title="Real Purchasing Power: Income After Rent, 2024"
              source="Source: CSO disposable income 2024; RTB Q2 2024. Calculated as monthly disposable income minus monthly rent."
              whatThisMeans="After subtracting rent from disposable income, the West (€13,502/year) and South-East (€12,358/year) offer significantly more purchasing power than Dublin (€7,775/year). The affordability crisis in Dublin and the Mid-East effectively eliminates their nominal income advantage."
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={purchasingPowerData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={100} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: "'DM Sans', system-ui, sans-serif" }} />
                  <Bar dataKey="Disposable Income" fill={chartGreenLight} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="After Rent" fill={chartGreen} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel
              title="Rent as Share of Disposable Income, 2024"
              source="Source: CSO 2024; RTB Q2 2024"
              whatThisMeans="Dublin residents face rents that consume 77% of disposable income on average. After accounting for housing costs, regions like the West and South-East offer comparable or better purchasing power, challenging the notion that Dublin automatically offers a higher standard of living."
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={rentIncomeData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={100} />
                  <Tooltip content={<ChartTooltip prefix="" suffix="%" />} />
                  <Bar dataKey="rentToIncome" name="Rent/Income %" radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: v => `${v}%`, fontSize: 11, fill: axisColor }}>
                    {rentIncomeData.map((d, i) => (
                      <Cell key={i} fill={d.id === 'dublin' ? chartGreen : chartGreenLight} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel
              title="Unemployment Rate by Region, 2024"
              source="Source: CSO Labour Force Survey 2024"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={unemploymentData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `${v}%`} domain={[0, 10]} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={100} />
                  <Tooltip content={<ChartTooltip prefix="" suffix="%" />} />
                  <Bar dataKey="rate" name="Unemployment %" fill={chartGreenLight} radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: v => `${v}%`, fontSize: 11, fill: axisColor }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>
          </div>
        )}

        {/* ════════════════ SECTION 4: FISCAL PICTURE ════════════════ */}
        {activeSection === 'fiscal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <SectionTitle finding="Ireland collected €126bn in taxes in 2024. Corporation tax — dominated by a handful of multinationals — now represents 22% of all tax receipts, creating a structural concentration risk. Against GNI* (the real domestic economy), the national debt is 67% — much higher than the GDP-based figure of 38% suggests.">
              Public Finances: Revenue, Spending, and Debt
            </SectionTitle>

            <ChartPanel
              title="Tax Revenue by Category, 2024 (€bn)"
              source="Source: CSO Tax Statistics 2024"
            >
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={taxData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${v}bn`} />
                  <YAxis type="category" dataKey="tax" tick={{ fontSize: 11, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={160} />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1A1916', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontWeight: 600 }}>{d.tax}</div>
                        <div>€{d.amount}bn ({d.pct}% of total)</div>
                      </div>
                    );
                  }} />
                  <Bar dataKey="amount" fill={chartGreen} radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: v => `€${v}bn`, fontSize: 11, fill: axisColor }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            {/* Risk callout */}
            <div className="card" style={{ padding: '20px 28px', borderLeft: '4px solid #0D6B4F' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0D6B4F', marginBottom: 4 }}>Corporation Tax Concentration Risk</p>
              <p style={{ fontSize: 14, color: '#6B6860', lineHeight: 1.6 }}>
                46% of all corporation tax was paid by just 3 companies in 2024 (Apple, Microsoft, Eli Lilly). 88% of CT comes from foreign-owned multinationals. Corporation tax now accounts for 22% of all government revenue — creating a structural fiscal vulnerability.
              </p>
              <p className="source-note">Source: IFAC Fiscal Assessment Report, February 2026</p>
            </div>

            <ChartPanel
              title="Government Expenditure by Department, 2024 (€bn)"
              source="Source: whereyourmoneygoes.gov.ie"
            >
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={spendData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${v}bn`} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={130} />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1A1916', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontWeight: 600 }}>{d.category}</div>
                        <div>€{d.amount.toFixed(1)}bn</div>
                      </div>
                    );
                  }} />
                  <Bar dataKey="amount" fill={chartGreenLight} radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: v => `€${v}bn`, fontSize: 11, fill: axisColor }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel
              title="National Debt: % of GDP vs % of GNI*, 2019–2024"
              source="Source: CSO Government Finance Statistics 2024"
              whatThisMeans="Ireland's debt/GDP ratio (38.3%) appears very low internationally. But GDP is heavily distorted by MNCs. Measured against GNI* — actual domestic income — the debt burden is 67%, much closer to EU norms."
            >
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={debtLineData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: axisColor }} />
                  <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `${v}%`} domain={[30, 110]} />
                  <Tooltip content={<ChartTooltip prefix="" suffix="%" />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: "'DM Sans', system-ui, sans-serif" }} />
                  <Line type="monotone" dataKey="Debt/GDP %" stroke={chartGrey} strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Debt/GNI* %" stroke={chartGreen} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>
          </div>
        )}

        {/* ════════════════ SECTION 5: RENEWABLE ENERGY ════════════════ */}
        {activeSection === 'energy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <SectionTitle finding={`Ireland has ${nationalWindStats.currentGw} GW of installed wind capacity against a 2030 target of ${nationalWindStats.target2030Gw} GW — a gap of ${nationalWindStats.targetGap} GW. Grid constraints in the West and North-West are curtailing existing generation and blocking new connections. Wind energy saved the economy €1.2bn in fossil fuel imports in 2024.`}>
              Renewable Energy and the Grid
            </SectionTitle>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <KPICard label="Installed wind capacity" value={`${nationalWindStats.currentGw} GW`} sub="Source: Wind Energy Ireland 2024" />
              <KPICard label="2030 target gap" value={`${nationalWindStats.targetGap} GW`} sub={`Target: ${nationalWindStats.target2030Gw} GW onshore wind`} />
              <KPICard label="Annual generation" value={`${(nationalWindStats.annualGwh / 1000).toFixed(1)} TWh`} sub="Source: EirGrid 2024" />
              <KPICard label="Fossil fuel savings 2024" value="€1.2bn" sub="Source: Wind Energy Ireland" />
            </div>

            <ChartPanel
              title="Installed Wind Capacity by County, 2024 (MW)"
              source="Source: Wind Energy Ireland 2024"
              whatThisMeans="Kerry (746 MW) and Cork (705 MW) lead on installed capacity, but the biggest untapped potential is in the West and North-West, where grid constraints are limiting deployment. Donegal, Mayo, and Galway all face critical curtailment risk despite having excellent wind resources."
            >
              <ResponsiveContainer width="100%" height={Math.max(280, windCapacityData.length * 32)}>
                <BarChart data={windCapacityData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `${v} MW`} />
                  <YAxis type="category" dataKey="county" tick={{ fontSize: 12, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={100} />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1A1916', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontWeight: 600 }}>{d.county}</div>
                        <div>{d.capacity} MW installed</div>
                        <div>{d.annualGwh} GWh/year</div>
                        <div>Curtailment risk: {d.curtailmentRisk}</div>
                      </div>
                    );
                  }} />
                  <Bar dataKey="capacity" radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: v => `${v} MW`, fontSize: 11, fill: axisColor }}>
                    {windCapacityData.map((d, i) => (
                      <Cell key={i} fill={d.gridConstrained ? chartGrey : chartGreen} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: axisColor }}>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: chartGreen, marginRight: 4 }} />Grid unconstrained</span>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: chartGrey, marginRight: 4 }} />Grid constrained</span>
              </div>
            </ChartPanel>

            {/* Grid constraint table */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '20px 28px 8px' }}>
                <h3 style={{ fontSize: 18 }}>Grid Constraint and Curtailment Risk</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E2DFD8', background: '#F9F8F4' }}>
                      <th style={{ padding: '10px 20px', textAlign: 'left', color: '#6B6860' }}>County</th>
                      <th style={{ padding: '10px 20px', textAlign: 'right', color: '#6B6860' }}>Capacity (MW)</th>
                      <th style={{ padding: '10px 20px', textAlign: 'right', color: '#6B6860' }}>Annual GWh</th>
                      <th style={{ padding: '10px 20px', textAlign: 'center', color: '#6B6860' }}>Grid Constrained</th>
                      <th style={{ padding: '10px 20px', textAlign: 'center', color: '#6B6860' }}>Curtailment Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renewableData.filter(r => r.capacity > 0).map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #EDEAE4' }}>
                        <td style={{ padding: '10px 20px', fontWeight: 500 }}>{r.county}</td>
                        <td style={{ padding: '10px 20px', textAlign: 'right' }}>{r.capacity}</td>
                        <td style={{ padding: '10px 20px', textAlign: 'right' }}>{r.annualGwh.toLocaleString()}</td>
                        <td style={{ padding: '10px 20px', textAlign: 'center', color: r.gridConstrained ? '#D97706' : '#0D6B4F' }}>
                          {r.gridConstrained ? 'Yes' : 'No'}
                        </td>
                        <td style={{ padding: '10px 20px', textAlign: 'center', color: r.curtailmentRisk === 'Critical' ? '#DC2626' : r.curtailmentRisk === 'High' ? '#D97706' : axisColor }}>
                          {r.curtailmentRisk}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="source-note" style={{ padding: '12px 28px' }}>Source: Wind Energy Ireland 2024; EirGrid Transmission Reports</p>
            </div>

            {/* Investment callout */}
            <div className="card" style={{ padding: '20px 28px', borderLeft: '4px solid #0D6B4F' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0D6B4F', marginBottom: 4 }}>Grid Investment Gap</p>
              <p style={{ fontSize: 14, color: '#6B6860', lineHeight: 1.6 }}>
                Ireland needs to add {nationalWindStats.targetGap} GW of onshore wind capacity by 2030 to meet its Climate Action Plan target of {nationalWindStats.target2030Gw} GW. The total renewable electricity target is {nationalWindStats.totalRenewableTarget2030Gw} GW (including offshore wind and solar). The primary bottleneck is grid transmission capacity in the West and North-West, where EirGrid has identified critical connection delays.
              </p>
              <p className="source-note">Source: EirGrid, Climate Action Plan 2024</p>
            </div>
          </div>
        )}

        {/* ════════════════ SECTION 6: POPULATION & MIGRATION ════════════════ */}
        {activeSection === 'population' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <SectionTitle finding={`Ireland's population is projected to grow from ${populationProjections[0].national / 1000}M (2022) to ${populationProjections[4].national / 1000}M by 2042. But growth is heavily concentrated in Dublin and the Mid-East, while the Border, Midlands, and West face population decline. Net migration in 2024 was +${migrationData.national.netMigration2024.toLocaleString()}, almost entirely to Dublin and the Mid-East.`}>
              Population, Migration, and Brain Drain
            </SectionTitle>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <KPICard label="Net migration 2024" value={`+${migrationData.national.netMigration2024.toLocaleString()}`} sub="Source: CSO Population Estimates 2024" />
              <KPICard label="Projected population 2042" value={`${(populationProjections[4].national / 1000).toFixed(1)}M`} sub="Source: CSO Regional Projections 2025" />
              <KPICard label="Border decline 2022–2042" value={`-${((1 - populationProjections[4].northwest / populationProjections[0].northwest) * 100).toFixed(0)}%`} sub="From 298k to 264k" />
              <KPICard label="Mid-East growth 2022–2042" value={`+${(((populationProjections[4].mideast / populationProjections[0].mideast) - 1) * 100).toFixed(0)}%`} sub="From 905k to 1,100k" />
            </div>

            <ChartPanel
              title="Regional Population Projections, 2022–2042 (thousands)"
              source="Source: CSO Regional Population Projections M2F2 scenario, January 2025. National totals from CSO publication; per-NUTS3 regional splits are modelled from CSO NUTS3 population share trajectories."
              whatThisMeans="Dublin and the Mid-East are projected to grow steadily through to 2042, driven by migration and natural increase. The Border and Midlands face sustained decline as younger workers migrate eastward. Without policy intervention, the West will begin declining from 2027."
            >
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={popLineData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: axisColor }} />
                  <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `${v}k`} />
                  <Tooltip content={<ChartTooltip prefix="" suffix="k" />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: "'DM Sans', system-ui, sans-serif" }} />
                  <Line type="monotone" dataKey="dublin" name="Dublin" stroke={chartGreen} strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="mideast" name="Mid-East" stroke="#8BAF9E" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="southwest" name="South-West" stroke="#D4A574" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="west" name="West" stroke="#7CA5B8" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="southeast" name="South-East" stroke="#B8A9C9" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="northwest" name="Border" stroke={chartGrey} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="midlands" name="Midlands" stroke="#E8A87C" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel
              title="Net Migration by Region, 2024"
              source="Source: CSO Population & Migration Estimates 2024"
              whatThisMeans="Dublin attracted +33,400 net migrants in 2024 — more than all other regions combined. The West, Border, and Midlands are losing population through net outward migration, with the Border region losing 4,200 people — reinforcing a cycle of declining services and further outmigration."
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={migrationBarData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => v.toLocaleString()} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={100} />
                  <Tooltip content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1A1916', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontWeight: 600 }}>{label}</div>
                        <div>Net migration: {payload[0].value > 0 ? '+' : ''}{payload[0].value.toLocaleString()}</div>
                      </div>
                    );
                  }} />
                  <ReferenceLine x={0} stroke={axisColor} strokeDasharray="4 4" />
                  <Bar dataKey="Net Migration" radius={[0, 6, 6, 0]}>
                    {migrationBarData.map((d, i) => (
                      <Cell key={i} fill={d['Net Migration'] >= 0 ? chartGreen : '#D97706'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            {/* Net migration table */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '20px 28px 8px' }}>
                <h3 style={{ fontSize: 18 }}>Net Migration by Region, 2024</h3>
                <p style={{ fontSize: 13, color: '#A8A69F', marginTop: 4 }}>Regional net flow figures are modelled estimates based on the CSO national total (net +80,200). CSO does not publish per-NUTS3 net migration directly.</p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E2DFD8', background: '#F9F8F4' }}>
                      <th style={{ padding: '10px 20px', textAlign: 'left', color: '#6B6860' }}>Region</th>
                      <th style={{ padding: '10px 20px', textAlign: 'right', color: '#6B6860' }}>Est. Net Flow</th>
                      <th style={{ padding: '10px 20px', textAlign: 'center', color: '#6B6860' }}>Pop Share Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {migrationData.regions.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #EDEAE4' }}>
                        <td style={{ padding: '10px 20px', fontWeight: 500 }}>{r.name}</td>
                        <td style={{ padding: '10px 20px', textAlign: 'right', color: r.netFlow >= 0 ? '#0D6B4F' : '#D97706' }}>
                          {r.netFlow >= 0 ? '+' : ''}{r.netFlow.toLocaleString()} <span style={{ fontSize: 11, color: '#A8A69F' }}>est.</span>
                        </td>
                        <td style={{ padding: '10px 20px', textAlign: 'center', color: r.popShareChange.startsWith('-') ? '#D97706' : '#0D6B4F' }}>
                          {r.popShareChange}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="source-note" style={{ padding: '12px 28px' }}>Source: CSO Population and Migration Estimates April 2025 (national total). Regional splits modelled from CSO NUTS3 population shares and commentary.</p>
            </div>
          </div>
        )}

        {/* ════════════════ SECTION 7: IRELAND & EUROPE ════════════════ */}
        {activeSection === 'europe' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <SectionTitle finding="Ireland's national GVA per person (€99,513) places it among the top economies in Europe. However, this figure is significantly distorted by multinational activity — Ireland's GNI* per capita (€59,463) tells a more realistic story, placing Ireland closer to the EU average.">
              Ireland in a European Context
            </SectionTitle>

            <div className="card" style={{ padding: '16px 24px', borderLeft: '4px solid #0D6B4F', background: '#E8F4EF' }}>
              <p style={{ fontSize: 14, color: '#1A1916', lineHeight: 1.6 }}>
                <strong>Note:</strong> Ireland&apos;s GDP and GVA figures are distorted by multinational profit-booking and intellectual property transfers. GNI* (Modified GNI) was developed by the CSO specifically to exclude these effects and better reflect the domestic economy.
              </p>
            </div>

            {/* Scatter plot first */}
            <ChartPanel
              title="GVA per Capita vs Unemployment: Irish Regions and EU Countries"
              source=""
            >
              <ScatterPlot regions={irishRegions} />
            </ChartPanel>

            <ChartPanel
              title="GVA per Capita by EU Country, 2024 (€, estimated)"
              source="Source: Eurostat Regional Statistics 2022–2023 (estimated). EU country figures are estimated; for precise Eurostat PPS comparisons see ec.europa.eu/eurostat."
              whatThisMeans="At face value, Ireland appears to be the second-wealthiest country in Europe. GNI*, which strips out multinational distortions, gives a per-capita figure of €59,463 — still well above the EU average, but significantly lower than headline GDP suggests. Ireland's prosperity is real, but concentrated."
            >
              <ResponsiveContainer width="100%" height={Math.max(400, euBarData.length * 26)}>
                <BarChart data={euBarData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={120} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine x={macroIndicators.gniStarPerCapita} stroke="#0D6B4F" strokeDasharray="6 4" label={{ value: 'Ireland GNI* €59,463', position: 'top', fontSize: 10, fill: '#0D6B4F' }} />
                  <Bar dataKey="gvaPerCapita" radius={[0, 4, 4, 0]}>
                    {euBarData.map((d, i) => (
                      <Cell key={i} fill={d.category === 'ireland' ? chartGreen : chartGreenLight} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>
          </div>
        )}

        {/* ════════════════ SECTION 8: POLICY & INVESTMENT ════════════════ */}
        {activeSection === 'policy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <SectionTitle finding="NDP investment per capita is estimated at €17,606 in Dublin compared to €4,286 in the Midlands. Five of seven regions receive below-proportional investment relative to population. Budget figures are derived from NDP 2021–2030 published allocations and Budget 2025; per-NUTS3 breakdowns are modelled estimates, not official government regional tables.">
              Policy, Investment, and the Regional Gap
            </SectionTitle>

            <ChartPanel
              title="NDP Investment per Capita by Region (€)"
              source="Source: NDP 2021-2030; Budget 2025 allocations"
              whatThisMeans="Dublin receives €17,606 per person in NDP investment compared to just €4,286 in the Midlands. While Dublin's higher allocation partly reflects the scale of its infrastructure needs (housing, transport), the gap means that regions which already lag in infrastructure receive the least investment to close the gap."
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={investmentBarData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                  <CartesianGrid stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={100} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="perCapita" name="NDP per Capita" radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: v => `€${v.toLocaleString()}`, fontSize: 11, fill: axisColor }}>
                    {investmentBarData.map((d, i) => (
                      <Cell key={i} fill={d.rating === 'Over-funded' ? chartGrey : d.rating === 'Balanced' ? chartGreenLight : chartGreen} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: axisColor }}>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: chartGreen, marginRight: 4 }} />Under-funded</span>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: chartGreenLight, marginRight: 4 }} />Balanced</span>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: chartGrey, marginRight: 4 }} />Over-funded</span>
              </div>
            </ChartPanel>

            {/* Budget share vs population share */}
            <ChartPanel
              title="Budget Share vs Population Share by Region"
              source="Source: NDP 2021-2030; CSO Census 2022"
              whatThisMeans="Dublin receives 35% of the NDP budget with 23% of the population. The Mid-East (14% of population) receives just 8% of the budget — the largest gap of any region. Proportional allocation would release capital for under-invested areas without reducing Dublin's absolute funding."
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={investmentGapData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                  <CartesianGrid stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<ChartTooltip prefix="" suffix="%" />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: "'DM Sans', system-ui, sans-serif" }} />
                  <Bar dataKey="budgetShare" name="Budget Share %" fill={chartGreen} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="popShare" name="Population Share %" fill={chartGrey} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            {/* Recommendation cards */}
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 16, fontFamily: "'DM Serif Display', Georgia, serif" }}>Key Recommendations</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                {[
                  { title: 'Grid Infrastructure', body: 'Prioritise EirGrid transmission upgrades in the West and North-West to unlock 3+ GW of wind capacity currently blocked by connection delays.', icon: '⚡' },
                  { title: 'Housing Outside Dublin', body: 'Redirect housing delivery incentives to the Mid-East, South-East, and South-West where population growth is outpacing supply and rent burdens are rising fastest.', icon: '🏠' },
                  { title: 'Regional FDI Strategy', body: 'Expand IDA regional office capacity beyond Dublin and Cork. The Northern & Western region receives just 4% of FDI despite 14% of population.', icon: '🏢' },
                  { title: 'Water & Wastewater', body: 'Uisce Éireann compliance rates in the Border and Midlands remain below 80%. Water infrastructure investment is a precondition for housing and industrial development.', icon: '💧' },
                ].map((card, i) => (
                  <div key={i} className="card" style={{ padding: '20px 24px' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{card.icon}</div>
                    <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1A1916' }}>{card.title}</h4>
                    <p style={{ fontSize: 13, color: '#6B6860', lineHeight: 1.6 }}>{card.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment rating table */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '20px 28px 8px' }}>
                <h3 style={{ fontSize: 18 }}>Regional Investment Summary</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E2DFD8', background: '#F9F8F4' }}>
                      <th style={{ padding: '10px 20px', textAlign: 'left', color: '#6B6860' }}>Region</th>
                      <th style={{ padding: '10px 20px', textAlign: 'right', color: '#6B6860' }}>NDP Budget (€M)</th>
                      <th style={{ padding: '10px 20px', textAlign: 'right', color: '#6B6860' }}>Per Capita (€)</th>
                      <th style={{ padding: '10px 20px', textAlign: 'right', color: '#6B6860' }}>Pop Share %</th>
                      <th style={{ padding: '10px 20px', textAlign: 'right', color: '#6B6860' }}>Budget Share %</th>
                      <th style={{ padding: '10px 20px', textAlign: 'center', color: '#6B6860' }}>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investmentGapData.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #EDEAE4' }}>
                        <td style={{ padding: '10px 20px', fontWeight: 500 }}>{r.name}</td>
                        <td style={{ padding: '10px 20px', textAlign: 'right' }}>€{r.budget.toLocaleString()}M</td>
                        <td style={{ padding: '10px 20px', textAlign: 'right' }}>€{r.perCapita.toLocaleString()}</td>
                        <td style={{ padding: '10px 20px', textAlign: 'right' }}>{r.popShare}%</td>
                        <td style={{ padding: '10px 20px', textAlign: 'right' }}>{r.budgetShare}%</td>
                        <td style={{ padding: '10px 20px', textAlign: 'center', color: r.rating === 'Under-funded' ? '#D97706' : r.rating === 'Over-funded' ? axisColor : '#0D6B4F', fontWeight: 500 }}>
                          {r.rating}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="source-note" style={{ padding: '12px 28px' }}>Source: NDP 2021–2030 published allocations; Budget 2025; CSO Census 2022. Per-NUTS3 budget figures are modelled estimates — the government does not publish a single official per-NUTS3 capital allocation table.</p>
            </div>
          </div>
        )}

        {/* ════════════════ SECTION 9: METHODS & SOURCES ════════════════ */}
        {activeSection === 'methods' && (
          <Suspense fallback={<div style={{ padding: 40, color: '#A8A69F', textAlign: 'center' }}>Loading...</div>}>
            <MethodsPage />
          </Suspense>
        )}
      </main>

      <footer style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 48px', borderTop: '1px solid #E2DFD8' }}>
        <p style={{ fontSize: 12, color: '#A8A69F' }}>
          Irish Regional Economics 2024 Analysis. Data from CSO, Eurostat, IFAC, Revenue Commissioners, RTB, Wind Energy Ireland. Built with Next.js and Recharts.
        </p>
      </footer>
    </div>
  );
}
