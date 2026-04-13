'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import PageHero from '../../components/ui/PageHero';
import ChartCard from '../../components/ui/ChartCard';
import Callout from '../../components/ui/Callout';
import regionsData from '../../data/regions.json';

const chartGreen = '#0D6B4F';
const chartGreenLight = '#8BAF9E';
const chartGrey = '#C5CCC9';
const axisColor = '#6B6860';
const gridColor = '#F0EDE8';

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

function getBarColor(ndpPerCapita) {
  if (ndpPerCapita > 12000) return chartGrey;       // over-funded (Dublin)
  if (ndpPerCapita >= 8000) return chartGreenLight;  // balanced
  return chartGreen;                                  // under-funded
}

const RECOMMENDATIONS = [
  {
    title: 'Grid Infrastructure',
    body: 'EirGrid transmission upgrades in the West and North-West are needed to unlock 3+ GW of wind capacity. The current grid cannot support deployment at the rate required to meet 2030 targets.',
  },
  {
    title: 'Housing Outside Dublin',
    body: 'Redirect delivery incentives to the Mid-East, South-East, and South-West where population growth is outpacing housing supply. Continued Dublin-centricity worsens affordability across the eastern corridor.',
  },
  {
    title: 'Regional FDI Strategy',
    body: "Expand IDA Ireland's regional mandate. The Northern & Western region attracts just 4% of foreign direct investment despite accounting for 14% of the population — a structural imbalance requiring active intervention.",
  },
  {
    title: 'Water & Wastewater',
    body: 'Uisce Éireann wastewater compliance in the Border and Midlands falls below 80%. Investment in water infrastructure is a precondition for both housing delivery and industrial development in lagging regions.',
  },
];

export default function PolicyInvestmentPage() {
  // Prepare NDP per capita data from regionsData
  const ndpData = [...regionsData]
    .filter(r => r.ndpPerCapita != null)
    .sort((a, b) => b.ndpPerCapita - a.ndpPerCapita)
    .map(r => ({ name: r.name || r.id, ndpPerCapita: r.ndpPerCapita }));

  // Prepare budget vs pop share data
  const shareData = regionsData
    .filter(r => r.ndpBudgetM != null && r.population != null)
    .map(r => ({
      name: r.name || r.id,
      budgetShare: parseFloat(((r.ndpBudgetM / 49000) * 100).toFixed(1)),
      popShare: parseFloat(((r.population / 5180000) * 100).toFixed(1)),
    }));

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
      <PageHero
        badge="Policy & Investment · NDP 2021–2030"
        title="Policy, Investment, and the Regional Gap"
        takeaway="NDP investment per capita ranges from €17,606 in Dublin to €4,286 in the Midlands. Five of seven regions receive below-proportional investment relative to their population share. Per-NUTS3 budget figures used here are modelled estimates — the government does not publish a single official regional allocation table."
        lastUpdated="NDP 2021–2030; Budget 2025; CSO Census 2022"
      />

      {/* NDP Per Capita Bar Chart */}
      <ChartCard
        title="NDP Investment per Capita by Region (€)"
        source="NDP 2021–2030; Budget 2025. Per-NUTS3 figures are modelled estimates."
        geography="NUTS3"
        year="2021–2030"
        note="Dublin receives €17,606/person in NDP investment vs €4,286 in the Midlands. While Dublin's higher allocation partly reflects the scale of infrastructure needs, the gap reinforces underinvestment in lagging regions."
      >
        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: 12, color: axisColor }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: chartGreen, display: 'inline-block' }} />
            Under-funded (&lt;€8k)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: chartGreenLight, display: 'inline-block' }} />
            Balanced
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: chartGrey, display: 'inline-block' }} />
            Over-funded (Dublin)
          </span>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={ndpData}
            layout="vertical"
            margin={{ top: 0, right: 24, bottom: 0, left: 80 }}
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
              tick={{ fontSize: 12, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              width={76}
            />
            <Tooltip content={<ChartTooltip prefix="€" suffix="" />} />
            <Bar dataKey="ndpPerCapita" name="NDP per capita" radius={[0, 4, 4, 0]}>
              {ndpData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.ndpPerCapita)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Budget Share vs Pop Share Grouped Bar Chart */}
      <ChartCard
        title="NDP Budget Share vs Population Share by Region (%)"
        source="NDP 2021–2030; CSO Census 2022. Regional budget shares are modelled estimates."
        geography="NUTS3"
        year="2021–2030"
        note="Dublin receives 35% of NDP budget with 23% of population. Mid-East (14% of population) receives just 8% — the largest per-capita gap."
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={shareData}
            margin={{ top: 8, right: 24, bottom: 0, left: 0 }}
            barGap={2}
          >
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip content={<ChartTooltip prefix="" suffix="%" />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Bar dataKey="budgetShare" name="Budget Share %" fill={chartGreen} radius={[4, 4, 0, 0]} />
            <Bar dataKey="popShare" name="Population Share %" fill={chartGreenLight} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Recommendation Cards 2×2 Grid */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', margin: '40px 0 16px' }}>Policy Recommendations</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
        {RECOMMENDATIONS.map(rec => (
          <div
            key={rec.title}
            style={{
              background: 'white',
              border: '1px solid #E2DFD8',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: chartGreen,
                flexShrink: 0,
              }} />
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{rec.title}</h4>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#444', lineHeight: 1.6 }}>{rec.body}</p>
          </div>
        ))}
      </div>

      <Callout variant="warning">
        NDP regional allocation figures are modelled estimates based on published sectoral envelopes and regional population proxies. The government does not publish a single official per-NUTS3 capital allocation table.
      </Callout>
    </div>
  );
}
