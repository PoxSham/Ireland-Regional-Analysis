'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { nationalDebt } from '../data';

export default function DebtDashboard() {
  const debtYears = Object.keys(nationalDebt.history.gross).map(Number);
  const dualLineData = debtYears.map(y => ({
    year: y,
    'Debt/GDP %': nationalDebt.history.gdpPct[y],
    'Debt/GNI* %': nationalDebt.history.gniPct[y],
  }));

  const grossDebtData = debtYears.map(y => ({
    year: y,
    gross: nationalDebt.history.gross[y],
  }));

  const DualTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs space-y-1">
        <p className="font-bold text-white">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}%</p>
        ))}
      </div>
    );
  };

  const GrossTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs">
        <p className="font-bold text-white">{label}</p>
        <p className="text-blue-400">€{payload[0].value}bn</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">National Debt 2024</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Gross Debt', value: `€${(nationalDebt.gross2024 / 1000).toFixed(1)}bn`, color: '#3b82f6' },
          { label: 'Per Capita', value: `€${nationalDebt.perCapita.toLocaleString()}`, color: '#f59e0b' },
          { label: 'Debt/GDP', value: `${nationalDebt.asShareOfGdp}%`, color: '#64748b' },
          { label: 'Debt/GNI*', value: `${nationalDebt.asShareOfGniStar}%`, color: '#ef4444' },
          { label: 'Surplus 2024', value: `€${(nationalDebt.surplus2024 / 1000).toFixed(1)}bn`, color: '#06d6a0' },
        ].map(k => (
          <div key={k.label} className="rounded-xl border p-4" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
            <div className="text-xs text-slate-400 mb-1">{k.label}</div>
            <div className="text-xl font-bold" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Dual line chart: Debt/GDP vs Debt/GNI* */}
      <div className="rounded-2xl border p-6" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
        <h3 className="font-bold text-white mb-1">Debt Ratios: GDP vs GNI* (2019–2024)</h3>
        <p className="text-xs text-slate-400 mb-4">GDP-based ratio flatters Ireland. GNI*-based ratio shows the real burden on the domestic economy.</p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={dualLineData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} domain={[30, 110]} />
            <Tooltip content={<DualTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Line type="monotone" dataKey="Debt/GDP %" stroke="#64748b" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Debt/GNI* %" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gross debt bar chart */}
      <div className="rounded-2xl border p-6" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
        <h3 className="font-bold text-white mb-1">Gross National Debt (€bn, 2019–2024)</h3>
        <p className="text-xs text-slate-400 mb-4">Debt peaked at €236bn in 2021 (Covid) and has since declined slightly as surpluses emerged.</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={grossDebtData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `€${v}bn`} domain={[0, 250]} />
            <Tooltip content={<GrossTooltip />} />
            <Bar dataKey="gross" fill="#3b82f6" radius={[6, 6, 0, 0]} label={{ position: 'top', formatter: v => `€${v}bn`, fontSize: 10, fill: '#94a3b8' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Text note */}
      <div className="rounded-xl border p-5" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
        <p className="text-sm text-slate-300 leading-relaxed">
          Ireland&apos;s debt/GDP ratio ({nationalDebt.asShareOfGdp}%) appears very low internationally. But GDP is heavily distorted by MNCs. Measured against GNI* — actual domestic income — the debt burden is <strong className="text-white">{nationalDebt.asShareOfGniStar}%</strong>, much closer to EU norms. Debt servicing costs €{nationalDebt.debtServiceCost}bn annually at an average interest rate of {nationalDebt.avgInterestRate}%.
        </p>
      </div>

      <p className="text-xs text-slate-500">Source: CSO Government Finance Statistics Oct 2025 · NTMA Annual Report 2024 · IFAC Fiscal Assessment Report 2026</p>
    </div>
  );
}
