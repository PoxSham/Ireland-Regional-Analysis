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

const WIND_DATA = [
  { county: 'Kerry',     capacity: 746, annualGwh: 1664, constrained: false, risk: 'Low' },
  { county: 'Cork',      capacity: 705, annualGwh: 1421, constrained: false, risk: 'Medium' },
  { county: 'Donegal',   capacity: 455, annualGwh: 711,  constrained: true,  risk: 'Critical' },
  { county: 'Tipperary', capacity: 422, annualGwh: 890,  constrained: false, risk: 'Medium' },
  { county: 'Mayo',      capacity: 358, annualGwh: 829,  constrained: true,  risk: 'High' },
  { county: 'Galway',    capacity: 326, annualGwh: 833,  constrained: true,  risk: 'Critical' },
  { county: 'Clare',     capacity: 246, annualGwh: 590,  constrained: false, risk: 'Medium' },
];

const RISK_COLORS = {
  Critical: '#DC2626',
  High: '#EA580C',
  Medium: '#D97706',
  Low: '#16A34A',
};

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

export default function RenewableEnergyPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
      <PageHero
        badge="Renewable Energy · 2024"
        title="Renewable Energy and the Grid"
        takeaway="Ireland has 5.89 GW of installed renewable capacity against a 9 GW 2030 target — a gap of 3.11 GW. The primary bottleneck is grid transmission in the West and North-West, where excellent wind resources sit behind constrained infrastructure. Renewable generation avoided an estimated €1.2bn in fossil fuel costs in 2024."
        lastUpdated="Wind Energy Ireland 2024; EirGrid 2024"
      />

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        <KPICard label="Installed Capacity" value="5.89 GW" sub="Onshore wind + solar, 2024" />
        <KPICard label="2030 Target Gap" value="3.11 GW" sub="Need 9 GW total by 2030" />
        <KPICard label="Annual Generation" value="13.3 TWh" sub="Wind generation 2024" />
        <KPICard label="Fossil Fuel Savings" value="€1.2bn" sub="Estimated avoided fuel cost 2024" />
      </div>

      {/* Wind Capacity Chart */}
      <ChartCard
        title="Installed Wind Capacity by County (MW)"
        source="Wind Energy Ireland 2024; EirGrid Transmission Reports"
        geography="County"
        year="2024"
        note="Kerry and Cork lead on installed capacity. The biggest untapped potential is in the West and North-West, where grid constraints are limiting deployment. Donegal, Mayo, and Galway face Critical or High curtailment risk despite excellent wind resources."
      >
        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: 12, color: axisColor }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: chartGreen, display: 'inline-block' }} />
            Unconstrained
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: chartGrey, display: 'inline-block' }} />
            Grid-constrained
          </span>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={[...WIND_DATA].sort((a, b) => b.capacity - a.capacity)}
            layout="vertical"
            margin={{ top: 0, right: 24, bottom: 0, left: 70 }}
          >
            <CartesianGrid horizontal={false} stroke={gridColor} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              unit=" MW"
            />
            <YAxis
              dataKey="county"
              type="category"
              tick={{ fontSize: 12, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              width={65}
            />
            <Tooltip content={<ChartTooltip prefix="" suffix=" MW" />} />
            <Bar dataKey="capacity" name="Capacity" radius={[0, 4, 4, 0]}>
              {[...WIND_DATA].sort((a, b) => b.capacity - a.capacity).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.constrained ? chartGrey : chartGreen} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* County Data Table */}
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>County Wind Data</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2DFD8' }}>
                {['County', 'Capacity (MW)', 'Annual (GWh)', 'Grid Constrained', 'Curtailment Risk'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: axisColor, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...WIND_DATA].sort((a, b) => b.capacity - a.capacity).map((row, i) => (
                <tr key={row.county} style={{ borderBottom: '1px solid #F0EDE8', background: i % 2 === 0 ? 'white' : '#FAFAF9' }}>
                  <td style={{ padding: '9px 12px', fontWeight: 500, color: '#1A1A1A' }}>{row.county}</td>
                  <td style={{ padding: '9px 12px', color: '#333' }}>{row.capacity.toLocaleString()}</td>
                  <td style={{ padding: '9px 12px', color: '#333' }}>{row.annualGwh.toLocaleString()}</td>
                  <td style={{ padding: '9px 12px' }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                      background: row.constrained ? '#FEF2F2' : '#F0FDF4',
                      color: row.constrained ? '#DC2626' : '#16A34A',
                    }}>
                      {row.constrained ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={{ padding: '9px 12px' }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                      background: RISK_COLORS[row.risk] + '18',
                      color: RISK_COLORS[row.risk],
                    }}>
                      {row.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout variant="warning">
        <strong>Grid Investment Gap:</strong> Ireland needs 3.11 GW more onshore wind by 2030 to reach its 9 GW target. The total renewable electricity target is 22 GW by 2030. The primary bottleneck is grid transmission infrastructure in the West and North-West — regions with the best wind resources but insufficient transmission capacity to export generation to demand centres.
      </Callout>
    </div>
  );
}
