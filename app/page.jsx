'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell, ReferenceLine,
} from 'recharts';
import PageHero from './components/ui/PageHero';
import KPICard from './components/ui/KPICard';
import ChartCard from './components/ui/ChartCard';
import Callout from './components/ui/Callout';

import regionsData from './data/regions.json';
import nationalData from './data/national.json';

export const dynamic = 'force-static';

const chartGreen = '#0D6B4F';
const chartGreenLight = '#8BAF9E';
const chartGrey = '#C5CCC9';
const axisColor = '#6B6860';
const gridColor = '#F0EDE8';

function ChartTooltip({ active, payload, label, prefix = '€', suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1A1916', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || chartGreen }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}
        </div>
      ))}
    </div>
  );
}

export default function OverviewPage() {
  const regionGvaData = [...regionsData]
    .map(r => ({ name: r.shortName, gva: r.gvaNominal2024, color: r.color }))
    .sort((a, b) => b.gva - a.gva);

  const dublin = regionsData.find(r => r.id === 'dublin');
  const border = regionsData.find(r => r.id === 'northwest');

  const dublinTrend = Object.entries(dublin.gvaTimeSeries).map(([y, v]) => ({
    year: +y,
    Dublin: v,
    Border: border.gvaTimeSeries[y],
  }));

  const disparity = (dublin.gvaNominal2024 / border.gvaNominal2024).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageHero
        badge="NUTS3 Analysis · 2024"
        title="Ireland's Regional Economy in 2024"
        takeaway={`Ireland's national GVA per person (€99,513) is among the highest in Europe, but this masks a ${disparity}-fold gap between Dublin (€${dublin.gvaNominal2024.toLocaleString()}) and the Border region (€${border.gvaNominal2024.toLocaleString()}). National income figures are further inflated by multinational activity — GNI*, the truer measure of domestic income, stands at €${(nationalData.gni2024Bn).toFixed(1)}bn, or ${nationalData.gniAsShareOfGdp}% of GDP.`}
        lastUpdated="CSO County Incomes and GDP 2024"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <KPICard
          label="National GVA per person"
          value="€99,513"
          sub="Source: CSO County Incomes 2024"
        />
        <KPICard
          label="GNI* (domestic income)"
          value="€321.1bn"
          sub="Source: CSO ANA 2024"
        />
        <KPICard
          label="National unemployment"
          value="4.5%"
          sub="Source: CSO LFS 2024"
        />
        <KPICard
          label="Regional disparity"
          value={`${disparity}×`}
          sub="Dublin ÷ Border GVA per person"
        />
      </div>

      <Callout variant="finding">
        GNI* — Modified Gross National Income — strips out multinational IP transfers, aircraft leasing profits, and retained earnings of redomiciled companies. It provides a more honest picture of Irish domestic living standards than GDP or GVA.
      </Callout>

      <ChartCard
        title="GVA per Person by NUTS3 Region, 2024"
        source="CSO County Incomes and Regional GDP 2024, Table 4.1"
        geography="NUTS3 regions (7)"
        year={2024}
        note="Dublin's GVA per person (€173,586) is more than double the national average and over five times that of the Border region (€31,057). This gap has widened since 2015, driven by Dublin's concentration of high-value multinational activity."
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={regionGvaData} layout="vertical" margin={{ top: 5, right: 80, left: 10, bottom: 5 }}>
            <CartesianGrid stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }} width={100} />
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

      <ChartCard
        title="GVA per Person Divergence: Dublin vs Border, 2015–2024"
        source="CSO County Incomes and GDP, various years"
        geography="NUTS3: Dublin, Border"
        year={2024}
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
      </ChartCard>

      {/* Navigation hint to other sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 8 }}>
        {[
          { href: '/regional-output', label: 'Regional Output', desc: 'GVA by NUTS3 and county' },
          { href: '/household-income', label: 'Household Income', desc: 'Disposable income, rent, and purchasing power' },
          { href: '/fiscal-picture', label: 'Fiscal Picture', desc: 'Tax, spending, and national debt' },
          { href: '/ireland-europe', label: 'Ireland & Europe', desc: 'PPS comparison with EU countries' },
          { href: '/renewable-energy', label: 'Renewable Energy', desc: 'Wind capacity and grid constraints' },
          { href: '/population', label: 'Population', desc: 'Projections and migration to 2042' },
        ].map(({ href, label, desc }) => (
          <a key={href} href={href} style={{
            display: 'block',
            padding: '16px 20px',
            background: 'white',
            border: '1px solid #E2DFD8',
            borderRadius: 10,
            textDecoration: 'none',
            transition: 'border-color 0.15s',
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0D6B4F', marginBottom: 4, fontFamily: "'DM Sans', system-ui, sans-serif" }}>{label}</div>
            <div style={{ fontSize: 12, color: '#6B6860' }}>{desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
