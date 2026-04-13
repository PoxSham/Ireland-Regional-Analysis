'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

import PageHero from '../../components/ui/PageHero';
import ChartCard from '../../components/ui/ChartCard';
import KPICard from '../../components/ui/KPICard';
import Callout from '../../components/ui/Callout';

const chartGreen = '#0D6B4F';
const chartGreenLight = '#8BAF9E';
const chartGrey = '#C5CCC9';
const axisColor = '#6B6860';
const gridColor = '#F0EDE8';

const POP_DATA = [
  { year: 2022, Dublin: 1390, 'Mid-East': 905, 'South-West': 780, West: 748, 'South-East': 640, Border: 298, Midlands: 348 },
  { year: 2027, Dublin: 1440, 'Mid-East': 965, 'South-West': 800, West: 750, 'South-East': 655, Border: 292, Midlands: 342 },
  { year: 2032, Dublin: 1480, 'Mid-East': 1020, 'South-West': 818, West: 748, 'South-East': 668, Border: 284, Midlands: 334 },
  { year: 2037, Dublin: 1510, 'Mid-East': 1065, 'South-West': 830, West: 742, 'South-East': 675, Border: 275, Midlands: 324 },
  { year: 2042, Dublin: 1530, 'Mid-East': 1100, 'South-West': 838, West: 736, 'South-East': 678, Border: 264, Midlands: 312 },
];

const LINE_COLORS = {
  Dublin: '#0D6B4F',
  'Mid-East': '#8BAF9E',
  'South-West': '#D4A574',
  West: '#7CA5B8',
  'South-East': '#B8A9C9',
  Border: '#C5CCC9',
  Midlands: '#E8A87C',
};

const MIGRATION_DATA = [
  { name: 'Dublin',      flow: 33400 },
  { name: 'Mid-East',   flow: 12000 },
  { name: 'South-West', flow: 8200 },
  { name: 'South-East', flow: 2100 },
  { name: 'West',       flow: -2800 },
  { name: 'Midlands',   flow: -3100 },
  { name: 'Border',     flow: -4200 },
].sort((a, b) => b.flow - a.flow);

function ChartTooltip({ active, payload, label, prefix = '€', suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || chartGreen }}>{p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}</div>
      ))}
    </div>
  );
}

export default function PopulationPage() {
  const regions = Object.keys(LINE_COLORS);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
      <PageHero
        badge="Population · 2024"
        title="Population, Migration, and Regional Divergence"
        takeaway="Ireland's population is projected to grow from 5.18M (2022) to 5.78M by 2042, but growth is heavily concentrated in Dublin and the Mid-East. The Border region faces a decline of 11.4% over the same period, while Mid-East expands by 21.5%. Net migration reached +80,200 in 2024, with the east absorbing the majority of arrivals."
        lastUpdated="CSO Population and Migration Estimates 2024–2025; CSO Regional Population Projections 2025"
      />

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        <KPICard label="Net Migration 2024" value="+80,200" sub="National total (CSO PME 2024)" />
        <KPICard label="Projected Population 2042" value="5.78M" sub="M2F2 scenario (CSO 2025)" />
        <KPICard label="Border Decline 2022–2042" value="−11.4%" sub="From 298k to 264k" />
        <KPICard label="Mid-East Growth 2022–2042" value="+21.5%" sub="From 905k to 1,100k" />
      </div>

      {/* Population Projections Line Chart */}
      <ChartCard
        title="Regional Population Projections 2022–2042 (thousands)"
        source="CSO Regional Population Projections M2F2 scenario, January 2025"
        geography="NUTS3"
        year="2022–2042"
        note="Dublin and Mid-East grow steadily to 2042. Border and Midlands face sustained decline as workers migrate eastward. Without policy intervention, the West begins declining from 2027."
      >
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={POP_DATA} margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: axisColor }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} tickLine={false} axisLine={false} unit="k" />
            <Tooltip content={<ChartTooltip prefix="" suffix="k" />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            {regions.map(r => (
              <Line
                key={r}
                type="monotone"
                dataKey={r}
                stroke={LINE_COLORS[r]}
                strokeWidth={r === 'Dublin' || r === 'Mid-East' ? 2.5 : 1.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Net Migration Bar Chart */}
      <ChartCard
        title="Net Migration by Region, 2024 (modelled estimates)"
        source="CSO Population and Migration Estimates 2024–2025 (national total). Regional splits modelled."
        geography="NUTS3 (estimated)"
        year="2024"
        note="Regional net flow figures are modelled estimates based on the CSO national total (net +80,200). CSO does not publish per-NUTS3 net migration directly."
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={MIGRATION_DATA}
            layout="vertical"
            margin={{ top: 0, right: 24, bottom: 0, left: 72 }}
          >
            <CartesianGrid horizontal={false} stroke={gridColor} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => v.toLocaleString()}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 12, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              width={68}
            />
            <Tooltip content={<ChartTooltip prefix="" suffix=" persons" />} />
            <ReferenceLine x={0} stroke="#6B6860" strokeWidth={1} />
            <Bar dataKey="flow" name="Net Migration" radius={[0, 4, 4, 0]}>
              {MIGRATION_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.flow >= 0 ? chartGreen : '#D97706'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Callout variant="warning">
        Regional migration splits are modelled estimates from CSO national totals and historical NUTS3 population shares. These are not directly measured at NUTS3 level by the CSO.
      </Callout>
    </div>
  );
}
