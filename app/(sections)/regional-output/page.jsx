'use client';
import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine, Legend,
} from 'recharts';
import PageHero from '../../components/ui/PageHero';
import ChartCard from '../../components/ui/ChartCard';
import Callout from '../../components/ui/Callout';
import regionsData from '../../data/regions.json';
import nationalData from '../../data/national.json';

const chartGreen = '#0D6B4F';
const chartGreenLight = '#8BAF9E';
const axisColor = '#6B6860';
const gridColor = '#F0EDE8';

// County GVA data — CSO Table 4.1, 2024. Counties marked est. are CSO-suppressed estimates.
const COUNTY_DATA = [
  { name: 'Dublin', gva: 173586, region: 'Dublin', estimated: false },
  { name: 'South-West (Cork & Kerry)', gva: 155188, region: 'South-West', estimated: false, note: 'CSO suppresses Cork/Kerry split' },
  { name: 'Kildare', gva: 77944, region: 'Mid-East', estimated: false },
  { name: 'Louth', gva: 52961, region: 'Mid-East', estimated: false },
  { name: 'Westmeath', gva: 54559, region: 'Midlands', estimated: false },
  { name: 'Waterford', gva: 61209, region: 'South-East', estimated: false },
  { name: 'Galway', gva: 53426, region: 'West', estimated: false },
  { name: 'Clare', gva: 50104, region: 'South-West', estimated: false },
  { name: 'Sligo', gva: 38224, region: 'Border', estimated: false },
  { name: 'Monaghan', gva: 36685, region: 'Border', estimated: false },
  { name: 'Kilkenny', gva: 38151, region: 'South-East', estimated: false },
  { name: 'Carlow', gva: 37079, region: 'South-East', estimated: false },
  { name: 'Wexford', gva: 34274, region: 'South-East', estimated: false },
  { name: 'Wicklow', gva: 33949, region: 'Mid-East', estimated: false },
  { name: 'Meath', gva: 33407, region: 'Mid-East', estimated: false },
  { name: 'Offaly', gva: 33562, region: 'Midlands', estimated: false },
  { name: 'Laois', gva: 31152, region: 'Midlands', estimated: false },
  { name: 'Cavan', gva: 31429, region: 'Border', estimated: false },
  { name: 'Longford', gva: 27317, region: 'Midlands', estimated: false },
  { name: 'Roscommon', gva: 28000, region: 'West', estimated: true },
  { name: 'Mayo', gva: 38000, region: 'West', estimated: true },
  { name: 'Donegal', gva: 35000, region: 'Border', estimated: true },
  { name: 'Leitrim', gva: 26000, region: 'Border', estimated: true },
  { name: 'Tipperary', gva: 55000, region: 'South-East', estimated: true },
].sort((a, b) => b.gva - a.gva);

const INFRA_ROWS = [
  { name: 'Dublin', grid: 'Adequate', water: 'Adequate', broadband: 'High coverage', constraint: 'Housing capacity, transport saturation' },
  { name: 'South-West', grid: 'Constrained', water: 'Moderate', broadband: 'Good', constraint: 'Water supply, grid investment needed' },
  { name: 'Mid-East', grid: 'Constrained', water: 'Critical', broadband: 'Good', constraint: 'Water capacity critical, grid investment' },
  { name: 'South-East', grid: 'Constrained', water: 'Moderate', broadband: 'Moderate', constraint: 'Port infrastructure, grid capacity' },
  { name: 'West', grid: 'Severely constrained', water: 'Moderate', broadband: 'Below avg', constraint: 'Grid severely constrained, roads, broadband' },
  { name: 'Border', grid: 'Severely constrained', water: 'Poor', broadband: 'Below avg', constraint: 'Grid transmission, wastewater, peripherality' },
  { name: 'Midlands', grid: 'Constrained', water: 'Poor', broadband: 'Below avg', constraint: 'Manufacturing decline, grid access' },
];

function ChartTooltip({ active, payload, label, prefix = '€', suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i}>{p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}</div>
      ))}
    </div>
  );
}

function gridColor2(val) {
  if (val.includes('Severely')) return '#DC2626';
  if (val === 'Constrained' || val === 'Moderate' || val === 'Below avg') return '#D97706';
  return '#0D6B4F';
}
function waterColor(val) {
  if (val === 'Critical' || val === 'Poor') return '#DC2626';
  if (val === 'Moderate') return '#D97706';
  return '#0D6B4F';
}

export default function RegionalOutputPage() {
  const [view, setView] = useState('region');

  const regionGvaData = [...regionsData]
    .map(r => ({ name: r.shortName, gva: r.gvaNominal2024 }))
    .sort((a, b) => b.gva - a.gva);

  const gdpPopData = regionsData.map(r => ({
    name: r.shortName,
    'GDP Share %': r.gdpShare,
    'Population Share %': Math.round(r.population / 54000),
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageHero
        badge="Regional Output · NUTS3 · 2024"
        title="Where Output Is Concentrated"
        takeaway="Six of Ireland's seven NUTS3 regions produce GVA per person below the national average of €99,513. Dublin and South-West account for over 55% of national output. The Border and Midlands lag at just 31% and 38% of the national average respectively."
        lastUpdated="CSO County Incomes and Regional GDP 2024"
      />

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 8 }}>
        {['region', 'county'].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '8px 18px', fontSize: 13, borderRadius: 8, cursor: 'pointer',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              background: view === v ? '#0D6B4F' : 'white',
              color: view === v ? 'white' : '#6B6860',
              border: view === v ? '1px solid #0D6B4F' : '1px solid #E2DFD8',
              fontWeight: view === v ? 600 : 400,
            }}
          >
            {v === 'region' ? 'By NUTS3 Region' : 'By County'}
          </button>
        ))}
      </div>

      {view === 'region' ? (
        <ChartCard
          title="GVA per Person by NUTS3 Region, 2024"
          source="CSO County Incomes and Regional GDP 2024, Table 4.1"
          geography="NUTS3 (7 regions)"
          year={2024}
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={regionGvaData} layout="vertical" margin={{ top: 5, right: 80, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor }} width={100} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine x={nationalData.gvaPerCapita2024} stroke={chartGreenLight} strokeDasharray="6 4"
                label={{ value: 'National avg €99,513', position: 'top', fontSize: 10, fill: axisColor }} />
              <Bar dataKey="gva" radius={[0, 6, 6, 0]}
                label={{ position: 'right', formatter: v => `€${v.toLocaleString()}`, fontSize: 10, fill: axisColor }}>
                {regionGvaData.map((d, i) => (
                  <Cell key={i} fill={d.gva >= nationalData.gvaPerCapita2024 ? chartGreen : chartGreenLight} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : (
        <ChartCard
          title="GVA per Person by County, 2024"
          source="CSO County Incomes and Regional GDP 2024, Table 4.1"
          geography="County (CSO experimental estimates)"
          year={2024}
          note="Cork and Kerry GVA figures are combined as 'South-West' — CSO suppresses individual county figures for confidentiality. Counties marked est. are CSO-suppressed estimates derived from regional totals."
        >
          <ResponsiveContainer width="100%" height={Math.max(480, COUNTY_DATA.length * 24)}>
            <BarChart data={COUNTY_DATA} layout="vertical" margin={{ top: 5, right: 80, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: axisColor }} width={175} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine x={nationalData.gvaPerCapita2024} stroke={chartGreenLight} strokeDasharray="6 4"
                label={{ value: 'National avg', position: 'top', fontSize: 10, fill: axisColor }} />
              <Bar dataKey="gva" radius={[0, 4, 4, 0]}>
                {COUNTY_DATA.map((d, i) => (
                  <Cell key={i} fill={d.gva >= nationalData.gvaPerCapita2024 ? chartGreen : chartGreenLight} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <ChartCard
        title="GDP Share vs Population Share by Region"
        source="CSO Regional GDP 2024; CSO Census 2022"
        geography="NUTS3 (7 regions)"
        year={2024}
        note="Dublin contributes 41% of national GDP while housing just 23% of the population. FDI is highly concentrated in the Eastern & Midland NUTS2 region (71% of investment value by CSO FDI statistics), reinforcing existing disparities."
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gdpPopData} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
            <CartesianGrid stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} angle={-30} textAnchor="end" height={65} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `${v}%`} />
            <Tooltip content={<ChartTooltip prefix="" suffix="%" />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="GDP Share %" fill={chartGreen} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Population Share %" fill="#C5CCC9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Infrastructure constraints table */}
      <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '24px 28px 8px' }}>
          <h3 style={{ fontSize: 18, fontFamily: "'DM Serif Display', Georgia, serif", color: '#1A1916', marginBottom: 4 }}>Infrastructure Constraints by Category</h3>
          <p style={{ fontSize: 13, color: '#6B6860', lineHeight: 1.6 }}>
            Qualitative assessments derived from agency commentary — EirGrid, Uisce Éireann, EPA, ComReg. Not composite scores.
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ fontSize: 13, width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2DFD8', background: '#F9F8F4' }}>
                {['Region','Grid (EirGrid)','Water (Uisce Éireann)','Broadband (ComReg)','Key Constraint'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#6B6860', fontWeight: 500, fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INFRA_ROWS.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #EDEAE4' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 500 }}>{r.name}</td>
                  <td style={{ padding: '10px 16px', color: gridColor2(r.grid) }}>{r.grid}</td>
                  <td style={{ padding: '10px 16px', color: waterColor(r.water) }}>{r.water}</td>
                  <td style={{ padding: '10px 16px', color: r.broadband.includes('Below') ? '#D97706' : '#0D6B4F' }}>{r.broadband}</td>
                  <td style={{ padding: '10px 16px', color: '#6B6860', fontSize: 12 }}>{r.constraint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 11, color: '#A8A69F', padding: '12px 28px', borderTop: '1px solid #EDEAE4' }}>
          Sources: EirGrid Transmission Development Plan 2025–2034; Uisce Éireann Performance Report 2024; ComReg Quarterly Key Data Q3 2024; EPA Environmental Indicators 2024
        </p>
      </div>
    </div>
  );
}
