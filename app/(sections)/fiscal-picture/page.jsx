'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell, PieChart, Pie,
} from 'recharts';
import PageHero from '../../components/ui/PageHero';
import KPICard from '../../components/ui/KPICard';
import ChartCard from '../../components/ui/ChartCard';
import Callout from '../../components/ui/Callout';
import DataTable from '../../components/ui/DataTable';
import nationalData from '../../data/national.json';

const chartGreen = '#0D6B4F';
const chartGreenLight = '#8BAF9E';
const axisColor = '#6B6860';
const gridColor = '#F0EDE8';

function ChartTooltip({ active, payload, label, prefix = '', suffix = '' }) {
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

const debtGdpRows = Object.entries(nationalData.debtHistory.gdpPct).map(([yr, v]) => ({ year: yr, gdpPct: v }));
const debtGniRows = Object.entries(nationalData.debtHistory.gniPct).map(([yr, v]) => ({ year: yr, gniPct: v }));
const debtCombined = debtGdpRows.map(r => ({ year: r.year, 'Debt / GDP %': r.gdpPct, 'Debt / GNI* %': debtGniRows.find(g => g.year === r.year)?.gniPct ?? null }));

const SPENDING_COLORS = ['#0D6B4F', '#8BAF9E', '#4A90A4', '#6B7C5E', '#A8A69F', '#C5CCC9', '#D4C5B0', '#E2DFD8'];

export default function FiscalPicturePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageHero
        badge="Fiscal Picture · National · 2024"
        title="Ireland's Public Finances in 2024"
        takeaway={`Ireland recorded a fiscal surplus of €${nationalData.surplus2024Bn}bn in 2024. Total tax revenue reached €${nationalData.totalTaxRevenue2024Bn}bn. Corporation tax now accounts for ${nationalData.ctAsShareOfTax}% of all taxes — the top 10 multinationals pay ${nationalData.ctTop10Share}% of all CT receipts, creating a significant concentration risk.`}
        lastUpdated="IFAC Fiscal Assessment Report 2024; CSO Government Finance Statistics 2024"
      />

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <KPICard
          label="Budget Surplus 2024"
          value={`€${nationalData.surplus2024Bn}bn`}
          sub="General government balance"
          source="Dept of Finance / IFAC"
        />
        <KPICard
          label="Total Tax Revenue"
          value={`€${nationalData.totalTaxRevenue2024Bn}bn`}
          sub="2024 outturn"
          source="Revenue Commissioners"
        />
        <KPICard
          label="Corporation Tax"
          value={`€${nationalData.ctRevenue2024Bn}bn`}
          sub={`${nationalData.ctAsShareOfTax}% of all taxes`}
          source="Revenue Commissioners"
        />
        <KPICard
          label="Gross National Debt"
          value={`€${nationalData.grossDebt2024Bn}bn`}
          sub={`${nationalData.debtAsShareOfGdp}% of GDP · ${nationalData.debtAsShareOfGniStar}% of GNI*`}
          source="NTMA / CSO"
        />
      </div>

      {/* CT Concentration Warning */}
      <Callout variant="warning">
        <strong>Corporation Tax concentration risk:</strong> The top 10 multinationals account for {nationalData.ctTop10Share}% of all CT receipts. 88% of CT is paid by foreign-owned MNCs. The OECD Pillar Two 15% global minimum tax may reduce Ireland's competitiveness advantage and reduce future CT windfalls. IFAC has repeatedly flagged this as a structural fiscal risk.
      </Callout>

      {/* Tax breakdown */}
      <ChartCard
        title="Tax Revenue Breakdown 2024"
        subtitle="By category — €bn and % share"
        source="Revenue Commissioners"
        year="2024"
        geography="Ireland (national)"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={nationalData.taxBreakdown2024} layout="vertical" margin={{ left: 140, right: 40, top: 4, bottom: 4 }}>
            <CartesianGrid horizontal={false} stroke={gridColor} />
            <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${v}bn`} />
            <YAxis dataKey="tax" type="category" tick={{ fontSize: 11, fill: axisColor }} width={130} />
            <Tooltip content={<ChartTooltip prefix="€" suffix="bn" />} />
            <Bar dataKey="amountBn" name="Amount" radius={[0, 4, 4, 0]}>
              {nationalData.taxBreakdown2024.map((_, i) => (
                <Cell key={i} fill={i === 1 ? '#DC2626' : i === 0 ? chartGreen : chartGreenLight} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Spending breakdown */}
      <ChartCard
        title="Government Spending by Category 2024"
        subtitle="General government expenditure — €bn"
        source="Dept of Public Expenditure / CSO Government Finance Statistics"
        year="2024"
        geography="Ireland (national)"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={nationalData.govSpendingBreakdown2024} layout="vertical" margin={{ left: 140, right: 40, top: 4, bottom: 4 }}>
            <CartesianGrid horizontal={false} stroke={gridColor} />
            <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `€${v}bn`} />
            <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: axisColor }} width={130} />
            <Tooltip content={<ChartTooltip prefix="€" suffix="bn" />} />
            <Bar dataKey="amountBn" name="Spending" radius={[0, 4, 4, 0]} fill={chartGreen} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Debt trajectory */}
      <ChartCard
        title="National Debt as % of GDP vs GNI* (2019–2024)"
        subtitle="GNI* is Ireland's preferred modified national income measure — GDP is distorted by MNC accounting"
        source="NTMA; CSO; IFAC"
        year="2019–2024"
        geography="Ireland (national)"
        note="GDP-based headline flatters Ireland's fiscal position. GNI* provides a truer picture of underlying fiscal capacity."
      >
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={debtCombined} margin={{ left: 0, right: 20, top: 8, bottom: 4 }}>
            <CartesianGrid stroke={gridColor} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: axisColor }} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={v => `${v}%`} domain={[30, 110]} />
            <Tooltip content={<ChartTooltip suffix="%" />} />
            <Legend />
            <Line dataKey="Debt / GDP %" stroke={chartGreenLight} strokeWidth={2} dot={{ r: 3 }} />
            <Line dataKey="Debt / GNI* %" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <Callout variant="finding">
        <strong>The GNI* distinction matters:</strong> Ireland's debt-to-GDP ratio of {nationalData.debtAsShareOfGdp}% appears very low by European standards, but the debt-to-GNI* ratio of {nationalData.debtAsShareOfGniStar}% is a more meaningful indicator of the actual debt burden. IFAC uses GNI* as its primary fiscal anchor.
      </Callout>

      {/* Summary table */}
      <DataTable
        caption="Key Fiscal Indicators 2024"
        source="IFAC Fiscal Assessment Report 2024; CSO Government Finance Statistics 2024"
        columns={[
          { key: 'indicator', label: 'Indicator' },
          { key: 'value', label: 'Value' },
          { key: 'note', label: 'Note' },
        ]}
        rows={[
          { indicator: 'Budget Surplus', value: `€${nationalData.surplus2024Bn}bn`, note: 'General government balance' },
          { indicator: 'Total Tax Revenue', value: `€${nationalData.totalTaxRevenue2024Bn}bn`, note: '2024 outturn' },
          { indicator: 'Corporation Tax', value: `€${nationalData.ctRevenue2024Bn}bn (${nationalData.ctAsShareOfTax}% of total)`, note: `Top 3 MNCs: ${nationalData.ctTop3Share}% of CT; top 10: ${nationalData.ctTop10Share}%` },
          { indicator: 'Gross National Debt', value: `€${nationalData.grossDebt2024Bn}bn`, note: `${nationalData.debtAsShareOfGdp}% GDP · ${nationalData.debtAsShareOfGniStar}% GNI*` },
          { indicator: 'Debt per Capita', value: `€${nationalData.debtPerCapita.toLocaleString()}`, note: 'Based on 2024 population' },
          { indicator: 'Total Gov Spending', value: `€${nationalData.totalGovSpending2024Bn}bn`, note: 'General government expenditure' },
        ]}
      />
    </div>
  );
}
