'use client';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell,
} from 'recharts';
import PageHero from '../../components/ui/PageHero';
import KPICard from '../../components/ui/KPICard';
import ChartCard from '../../components/ui/ChartCard';
import Callout from '../../components/ui/Callout';
import DataTable from '../../components/ui/DataTable';
import regionsData from '../../data/regions.json';

const dublin = regionsData.find(r => r.id === 'dublin');
const chartGreen = '#0D6B4F';
const chartGreenLight = '#8BAF9E';
const chartRed = '#ef4444';
const axisColor = '#6B6860';
const gridColor = '#F0EDE8';
const nationalGvaPerPerson = 99513;

function Tip({ active, payload, label, prefix = '', suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || chartGreen }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}
        </div>
      ))}
    </div>
  );
}

const gvaTimeSeries = Object.entries(dublin.gvaTimeSeries).map(([yr, val]) => ({ year: yr, 'GVA per person': val }));
const incomeTimeSeries = Object.entries(dublin.disposableTimeSeries).map(([yr, val]) => ({ year: yr, 'Disposable Income': val }));
const unempTimeSeries = Object.entries(dublin.unemploymentTimeSeries).map(([yr, val]) => ({ year: yr, 'Unemployment %': val }));
const popProjection = Object.entries(dublin.populationProjection).map(([yr, val]) => ({ year: yr, 'Population (000s)': Math.round(val / 1000) }));

const infraData = [
  { subject: 'Grid', score: dublin.infraBreakdown.grid },
  { subject: 'Housing', score: dublin.infraBreakdown.housing },
  { subject: 'Water', score: dublin.infraBreakdown.water },
  { subject: 'Transport', score: dublin.infraBreakdown.transport },
  { subject: 'Broadband', score: dublin.infraBreakdown.broadband },
];

const regionalGvaComparison = [...regionsData]
  .map(r => ({ name: r.shortName, gva: r.gvaNominal2024, isDublin: r.id === 'dublin' }))
  .sort((a, b) => b.gva - a.gva);

export default function DublinRegionPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ fontSize: 12, color: axisColor, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <a href="/" style={{ color: chartGreen, textDecoration: 'none' }}>Overview</a>
        <span style={{ margin: '0 6px' }}>›</span>
        <a href="/regional-output" style={{ color: chartGreen, textDecoration: 'none' }}>Regional Output</a>
        <span style={{ margin: '0 6px' }}>›</span>
        <span>Dublin</span>
      </div>

      <PageHero
        badge="Region Profile · Dublin · NUTS3 · 2024"
        title="Dublin: Ireland's Economic Core"
        takeaway={`Dublin generates €${dublin.gvaNominal2024.toLocaleString()} GVA per person — ${Math.round(dublin.gvaNominal2024 / nationalGvaPerPerson * 100)}% of the national average of €${nationalGvaPerPerson.toLocaleString()}. With ${dublin.gdpShare}% of national GDP from ${(dublin.population / 1000000).toFixed(2)}m people (27% of the population), Dublin is Ireland's dominant economic centre — but rent consumes ${dublin.rentToIncome}% of disposable income, creating a severe affordability crisis.`}
        lastUpdated="CSO County Incomes 2024; CSO LFS 2024; RTB Q2 2024; Eurostat NUTS3 2023"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <KPICard label="GVA per Person 2024" value={`€${dublin.gvaNominal2024.toLocaleString()}`} sub={`${Math.round(dublin.gvaNominal2024/nationalGvaPerPerson*100)}% of national avg`} source="CSO 2024" />
        <KPICard label="GDP per Capita PPS 2023" value={`${dublin.gvaPPS2023.toLocaleString()} PPS`} sub="366% of EU27 average · Eurostat published" source="Eurostat NUTS3 2023" />
        <KPICard label="Population 2024" value={`${(dublin.population/1000000).toFixed(2)}m`} sub="27% of national population" source="CSO Population 2024" />
        <KPICard label="Unemployment" value={`${dublin.unemployment2024}%`} sub="Annual average 2024" source="CSO LFS 2024" />
        <KPICard label="Disposable Income" value={`€${dublin.disposableIncome2024.toLocaleString()}`} sub="Per person 2024" source="CSO Table 3.1" />
        <KPICard label="Monthly Rent" value={`€${dublin.rent2024.toLocaleString()}`} sub={`${dublin.rentToIncome}% of disposable income`} source="RTB Q2 2024" />
      </div>

      <Callout variant="warning">
        <strong>Housing affordability crisis:</strong> Dublin's rent-to-income ratio of {dublin.rentToIncome}% is extreme by European standards — the EU threshold for cost-burdened housing is 30%. A median Dublin renter spends three-quarters of their disposable income on rent, constraining living standards despite high nominal output figures.
      </Callout>

      <ChartCard title="GVA per Person 2015–2024" subtitle="Nominal €, current prices" source="CSO County Incomes and Regional GDP (various years)" year="2015–2024" geography="Dublin NUTS3" note="2023 was a peak at €179,800. The 2024 correction to €173,586 likely reflects MNC profit repatriation timing.">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={gvaTimeSeries} margin={{ left: 10, right: 20, top: 8, bottom: 4 }}>
            <defs>
              <linearGradient id="gvaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartGreen} stopOpacity={0.18} />
                <stop offset="95%" stopColor={chartGreen} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: axisColor }} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} domain={[100000, 190000]} />
            <Tooltip content={<Tip prefix="€" />} />
            <Area dataKey="GVA per person" stroke={chartGreen} fill="url(#gvaGrad)" strokeWidth={2.5} dot={{ r: 3, fill: chartGreen }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <ChartCard title="Disposable Income 2020–2024" subtitle="€ per person" source="CSO County Incomes Table 3.1" year="2020–2024" geography="Dublin NUTS3">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={incomeTimeSeries} margin={{ left: 10, right: 16, top: 8, bottom: 4 }}>
              <CartesianGrid stroke={gridColor} />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: axisColor }} />
              <YAxis tick={{ fontSize: 10, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} domain={[28000, 36000]} />
              <Tooltip content={<Tip prefix="€" />} />
              <Line dataKey="Disposable Income" stroke={chartGreen} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Unemployment Rate 2020–2024" subtitle="% annual average" source="CSO LFS 2024" year="2020–2024" geography="Dublin NUTS3">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={unempTimeSeries} margin={{ left: 10, right: 16, top: 8, bottom: 4 }}>
              <CartesianGrid stroke={gridColor} />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: axisColor }} />
              <YAxis tick={{ fontSize: 10, fill: axisColor }} tickFormatter={v => `${v}%`} domain={[2, 7]} />
              <Tooltip content={<Tip suffix="%" />} />
              <Line dataKey="Unemployment %" stroke={chartRed} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Population Projection 2022–2042" subtitle="CSO M2F2 scenario — thousands" source="CSO Regional Population Projections 2025" year="2022–2042" geography="Dublin NUTS3" note="Projections are modelled estimates under CSO M2F2 scenario. Actual outcomes depend on housing supply, migration policy, and economic conditions.">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={popProjection} margin={{ left: 10, right: 20, top: 8, bottom: 4 }}>
            <defs>
              <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartGreenLight} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartGreenLight} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: axisColor }} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `${v}k`} domain={[1350, 1600]} />
            <Tooltip content={<Tip suffix="k" />} />
            <Area dataKey="Population (000s)" stroke={chartGreenLight} fill="url(#popGrad)" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Dublin vs All NUTS3 Regions — GVA per Person 2024" subtitle="€ nominal · national average €99,513" source="CSO County Incomes and Regional GDP 2024 — Table 4.1" year="2024" geography="All 7 NUTS3 regions">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={regionalGvaComparison} margin={{ left: 10, right: 20, top: 8, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<Tip prefix="€" />} />
            <Bar dataKey="gva" name="GVA per person (€)" radius={[4, 4, 0, 0]}>
              {regionalGvaComparison.map((entry, i) => (
                <Cell key={i} fill={entry.isDublin ? chartRed : chartGreenLight} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Infrastructure Capacity Index" subtitle="Relative capacity score — 100 = fully adequate" source="EirGrid 2024; Irish Water; NTA; ComReg" year="2024" geography="Dublin NUTS3" note="Scores are qualitative capacity assessments. Housing (40) reflects acute undersupply relative to demand.">
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={infraData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke={gridColor} />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: axisColor }} />
            <Radar dataKey="score" stroke={chartGreen} fill={chartGreen} fillOpacity={0.18} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      <DataTable
        caption="Dublin Region — Key Data Summary 2024"
        source="CSO County Incomes 2024; CSO LFS 2024; RTB Q2 2024; Eurostat 2023; Wind Energy Ireland 2024"
        columns={[
          { key: 'metric', label: 'Metric' },
          { key: 'value', label: 'Dublin' },
          { key: 'national', label: 'National Avg' },
          { key: 'source', label: 'Source' },
        ]}
        rows={[
          { metric: 'GVA per person (nominal)', value: `€${dublin.gvaNominal2024.toLocaleString()}`, national: '€99,513', source: 'CSO 2024' },
          { metric: 'GDP per capita (PPS, 2023)', value: `${dublin.gvaPPS2023.toLocaleString()} PPS`, national: '81,200 PPS', source: 'Eurostat 2023' },
          { metric: 'Disposable income per person', value: `€${dublin.disposableIncome2024.toLocaleString()}`, national: '€29,500 (est.)', source: 'CSO Table 3.1' },
          { metric: 'Unemployment rate', value: `${dublin.unemployment2024}%`, national: '4.5%', source: 'CSO LFS 2024' },
          { metric: 'Mean monthly rent (new tenancy)', value: `€${dublin.rent2024.toLocaleString()}`, national: '—', source: 'RTB Q2 2024' },
          { metric: 'Rent-to-income ratio', value: `${dublin.rentToIncome}%`, national: '—', source: 'RTB / CSO derived' },
          { metric: 'Share of national GDP', value: `${dublin.gdpShare}%`, national: '—', source: 'CSO 2024' },
          { metric: 'Share of national employment', value: `${dublin.employmentShare}%`, national: '—', source: 'CSO 2024' },
          { metric: 'FDI employment share', value: `${dublin.fdiShare}%`, national: '—', source: 'CSO FDI 2023' },
          { metric: 'Wind capacity', value: `${dublin.windCapacityMW} MW`, national: '5,890 MW total', source: 'Wind Energy Ireland 2024' },
          { metric: 'Net migration balance 2024', value: `+${dublin.migrationBalance2024.toLocaleString()}`, national: '+81,600', source: 'CSO PME 2024' },
        ]}
      />

      <Callout variant="info">
        <strong>Key structural constraints:</strong> {dublin.keyConstraints}. Dublin's dominance creates a self-reinforcing capacity problem. The NDP 2021–2030 allocates an estimated €{(dublin.ndpBudgetM / 1000).toFixed(0)}bn to Dublin — ~€{dublin.ndpPerCapita.toLocaleString()} per capita — the highest in absolute terms, but still insufficient relative to demand pressures on housing, water, and transport.
      </Callout>
    </div>
  );
}
