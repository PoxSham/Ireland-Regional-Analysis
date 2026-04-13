'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Legend,
} from 'recharts';
import PageHero from '../../components/ui/PageHero';
import ChartCard from '../../components/ui/ChartCard';
import KPICard from '../../components/ui/KPICard';
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
        <div key={i} style={{ color: p.color }}>{p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}</div>
      ))}
    </div>
  );
}

export default function HouseholdIncomePage() {
  const incomeRentData = regionsData.map(r => ({
    name: r.shortName,
    'Disposable Income': r.disposableIncome2024,
    'Annual Rent': r.rent2024 * 12,
  })).sort((a, b) => b['Disposable Income'] - a['Disposable Income']);

  const rentToIncomeData = regionsData.map(r => ({
    name: r.shortName,
    id: r.id,
    rentToIncome: r.rentToIncome,
  })).sort((a, b) => b.rentToIncome - a.rentToIncome);

  // Real purchasing power = annual disposable - annual rent
  const purchasingPowerData = regionsData.map(r => ({
    name: r.shortName,
    'Disposable Income': r.disposableIncome2024,
    'After Rent': r.disposableIncome2024 - (r.rent2024 * 12),
  })).sort((a, b) => (b['After Rent'] - a['After Rent']));

  const unemploymentData = regionsData.map(r => ({
    name: r.shortName,
    rate: r.unemployment2024,
  })).sort((a, b) => b.rate - a.rate);

  const dublin = regionsData.find(r => r.id === 'dublin');
  const west = regionsData.find(r => r.id === 'west');
  const border = regionsData.find(r => r.id === 'northwest');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageHero
        badge="Household Income · 2024"
        title="Household Income and the Cost of Living"
        takeaway="Disposable income per person is more evenly distributed than output, but rent burden erases much of Dublin's income advantage. After housing costs, the West (€13,502/yr remaining) and South-East offer better real purchasing power than the capital (€7,775/yr remaining)."
        lastUpdated="CSO County Incomes 2024; RTB Q2 2024"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <KPICard label="Dublin disposable income" value={`€${dublin.disposableIncome2024.toLocaleString()}`} sub="Per person, 2024 · Source: CSO" />
        <KPICard label="Dublin rent-to-income" value={`${dublin.rentToIncome}%`} sub="Annual rent as % of disposable income" />
        <KPICard label="Border disposable income" value={`€${border.disposableIncome2024.toLocaleString()}`} sub="Per person, 2024 · Source: CSO" />
        <KPICard label="West after-rent purchasing power" value={`€${(west.disposableIncome2024 - west.rent2024 * 12).toLocaleString()}`} sub="Annual income after rent · 2024" />
      </div>

      <Callout variant="finding">
        After subtracting rent, the West offers €13,502/year more purchasing power than Dublin's €7,775. Dublin's income advantage effectively disappears when housing costs are factored in — challenging the assumption that the capital offers a higher standard of living.
      </Callout>

      <ChartCard
        title="Annual Disposable Income vs Annual Rent by Region, 2024"
        source="CSO County Incomes and Regional GDP 2024; RTB Rent Index Q2 2024"
        geography="NUTS3 (7 regions)"
        year={2024}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incomeRentData} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
            <CartesianGrid stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} angle={-30} textAnchor="end" height={65} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Disposable Income" fill={chartGreen} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Annual Rent" fill={chartGrey} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Real Purchasing Power: Income After Rent, 2024"
        source="CSO County Incomes 2024; RTB Rent Index Q2 2024"
        geography="NUTS3 (7 regions)"
        year={2024}
        note="Calculated as annual disposable income minus annual rent (monthly rent × 12). Assumes one renter per household — actual household arrangements vary."
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={purchasingPowerData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
            <CartesianGrid stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor }} width={100} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Disposable Income" fill={chartGreenLight} radius={[0, 4, 4, 0]} />
            <Bar dataKey="After Rent" fill={chartGreen} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Rent as Share of Disposable Income, 2024"
        source="CSO County Incomes 2024; RTB Rent Index Q2 2024"
        geography="NUTS3 (7 regions)"
        year={2024}
        note="A ratio above 30% is widely considered 'cost-burdened'. Dublin's 77% is among the most extreme affordability gaps in any EU capital region."
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={rentToIncomeData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
            <CartesianGrid stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor }} width={100} />
            <Tooltip content={<ChartTooltip prefix="" suffix="%" />} />
            <Bar dataKey="rentToIncome" name="Rent/Income %" radius={[0, 6, 6, 0]}
              label={{ position: 'right', formatter: v => `${v}%`, fontSize: 11, fill: axisColor }}>
              {rentToIncomeData.map((d, i) => (
                <Cell key={i} fill={d.id === 'dublin' ? chartGreen : chartGreenLight} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Unemployment Rate by Region, 2024"
        source="CSO Labour Force Survey (LFS) 2024"
        geography="NUTS3 (7 regions)"
        year={2024}
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={unemploymentData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
            <CartesianGrid stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `${v}%`} domain={[0, 10]} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor }} width={100} />
            <Tooltip content={<ChartTooltip prefix="" suffix="%" />} />
            <Bar dataKey="rate" name="Unemployment %" fill={chartGreenLight} radius={[0, 6, 6, 0]}
              label={{ position: 'right', formatter: v => `${v}%`, fontSize: 11, fill: axisColor }} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
