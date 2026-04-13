'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

import PageHero from '../../components/ui/PageHero';
import ChartCard from '../../components/ui/ChartCard';
import Callout from '../../components/ui/Callout';
import ScatterPlot from '../../components/ScatterPlot';
import regionsData from '../../data/regions.json';

const chartGreen = '#0D6B4F';
const chartGreenLight = '#8BAF9E';
const chartGrey = '#C5CCC9';
const axisColor = '#6B6860';
const gridColor = '#F0EDE8';

const EU_BAR_DATA = [
  { name: 'Luxembourg', gva: 91100 }, { name: 'Ireland',    gva: 81200 },
  { name: 'Netherlands', gva: 49500 }, { name: 'Denmark',   gva: 49500 },
  { name: 'Austria',    gva: 48400 }, { name: 'Germany',    gva: 46500 },
  { name: 'Sweden',     gva: 46500 }, { name: 'Belgium',    gva: 45700 },
  { name: 'Finland',    gva: 42700 }, { name: 'Malta',      gva: 40000 },
  { name: 'France',     gva: 38500 }, { name: 'Italy',      gva: 37000 },
  { name: 'Cyprus',     gva: 36200 }, { name: 'Czechia',    gva: 34700 },
  { name: 'Slovenia',   gva: 34300 }, { name: 'Spain',      gva: 33500 },
  { name: 'Portugal',   gva: 30500 }, { name: 'Poland',     gva: 29300 },
  { name: 'Hungary',    gva: 27400 }, { name: 'Romania',    gva: 27400 },
  { name: 'Greece',     gva: 25500 }, { name: 'Bulgaria',   gva: 24400 },
].sort((a, b) => b.gva - a.gva);

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

export default function IrelandEuropePage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
      <PageHero
        badge="Ireland & Europe · PPS · 2023"
        title="Ireland in a European Context"
        takeaway="Ireland's nominal GVA ranks second-highest in the EU at €81,200 per capita, but is significantly distorted by multinational profit-booking and intellectual property transfers. GNI* per capita (€59,463) — the CSO's modified measure that strips out these effects — gives a more realistic picture of living standards, while still placing Ireland well above the EU average."
        lastUpdated="Eurostat nama_10_pc 2023; Eurostat NUTS3 2023; CSO ANA 2024"
      />

      <Callout variant="info">
        GDP and GVA figures for Ireland are distorted by multinational profit-booking and intellectual property transfers. GNI* (Modified GNI) was developed by the CSO to exclude these effects. The scatter plot below uses GDP per capita in PPS — the Eurostat standard for cross-country comparison.
      </Callout>

      {/* Scatter Plot — Irish Regions and EU Countries */}
      <ChartCard
        title="GDP per Capita (PPS) vs Unemployment: Irish Regions and EU Countries, 2023"
        source="Eurostat NUTS3 PPS 2023; Eurostat nama_10_pc 2023; CSO LFS 2024"
        geography="NUTS3 (Irish regions) + EU member states"
        year="2023"
        note="X-axis uses Purchasing Power Standards (PPS), not nominal euros, for fair cross-country comparison. Dublin (139,500 PPS) and South-West (137,300 PPS) are Eurostat-published NUTS3 figures. Other Irish regions are derived estimates."
      >
        <ScatterPlot regions={regionsData} />
      </ChartCard>

      {/* EU Bar Chart */}
      <ChartCard
        title="GDP per Capita (PPS) by EU Country, 2023"
        source="Eurostat nama_10_pc 2023 · PPS index (EU27=100) × EU avg 38,100 PPS"
        geography="EU member states"
        year="2023"
        note="At face value, Ireland appears second-wealthiest in Europe. GNI* (€59,463/capita) — which strips out MNC distortions — is still well above the EU average but significantly lower than headline GDP/GVA suggests."
      >
        <ResponsiveContainer width="100%" height={520}>
          <BarChart
            data={EU_BAR_DATA}
            layout="vertical"
            margin={{ top: 0, right: 40, bottom: 0, left: 80 }}
          >
            <CartesianGrid horizontal={false} stroke={gridColor} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `€${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              width={76}
            />
            <Tooltip content={<ChartTooltip prefix="€" suffix=" PPS" />} />
            <ReferenceLine
              x={59463}
              stroke={chartGreen}
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{ value: 'Ireland GNI* €59,463', position: 'top', fontSize: 10, fill: chartGreen }}
            />
            <Bar dataKey="gva" name="GDP per capita (PPS)" radius={[0, 4, 4, 0]}>
              {EU_BAR_DATA.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === 'Ireland' ? chartGreen : chartGreenLight}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
