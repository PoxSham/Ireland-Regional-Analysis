'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { govSpending, nationalDebt } from '../data';

export default function GovSpending() {
  const breakdownSorted = [...govSpending.breakdown2024].sort((a, b) => b.amount - a.amount);

  const spendingHistory = [
    { year: 2019, total: govSpending.total2019 },
    { year: 2020, total: govSpending.total2020 },
    { year: 2021, total: govSpending.total2021 },
    { year: 2022, total: govSpending.total2022 },
    { year: 2023, total: govSpending.total2023 },
    { year: 2024, total: govSpending.total2024 },
  ];

  const BreakdownTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs">
        <p className="font-bold text-white">{d.category}</p>
        <p className="text-slate-300">€{d.amount.toFixed(1)}bn ({(d.amount / govSpending.total2024 * 100).toFixed(1)}% of total)</p>
      </div>
    );
  };

  const TrendTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs">
        <p className="font-bold text-white">{label}</p>
        <p className="text-emerald-400">€{payload[0].value.toFixed(1)}bn</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Government Spending 2024</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Spending', value: `€${govSpending.total2024}bn`, sub: '+8% YoY', color: '#169B62' },
          { label: 'Per Capita', value: `€${govSpending.perCapita2024.toLocaleString()}`, sub: '€116.1bn / 5.4M', color: '#3b82f6' },
          { label: 'As % of GNI*', value: `${govSpending.asShareOfGniStar}%`, sub: 'True spending ratio', color: '#f59e0b' },
          { label: 'Surplus 2024', value: `€${(nationalDebt.surplus2024 / 1000).toFixed(1)}bn`, sub: 'Revenue > spending', color: '#06d6a0' },
        ].map(k => (
          <div key={k.label} className="rounded-xl border p-4" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
            <div className="text-xs text-slate-400 mb-1">{k.label}</div>
            <div className="text-xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs text-slate-500 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Horizontal bar chart */}
      <div className="rounded-2xl border p-6" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
        <h3 className="font-bold text-white mb-1">Spending by Department (€bn, 2024)</h3>
        <p className="text-xs text-slate-400 mb-4">Sorted by amount. Social Protection and Health account for 44% of all spending.</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={breakdownSorted} layout="vertical" margin={{ top: 5, right: 40, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `€${v}bn`} />
            <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#94a3b8' }} width={120} />
            <Tooltip content={<BreakdownTooltip />} />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: v => `€${v}bn`, fontSize: 11, fill: '#94a3b8' }}>
              {breakdownSorted.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Spending trend line */}
      <div className="rounded-2xl border p-6" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
        <h3 className="font-bold text-white mb-1">Total Government Spending 2019–2024 (€bn)</h3>
        <p className="text-xs text-slate-400 mb-4">Spending rose 60% in five years — from €72.5bn to €116.1bn.</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={spendingHistory} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `€${v}bn`} domain={[60, 125]} />
            <Tooltip content={<TrendTooltip />} />
            <Line type="monotone" dataKey="total" stroke="#169B62" strokeWidth={2.5} dot={{ r: 4, fill: '#169B62' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Explanation */}
      <div className="rounded-xl border p-5" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
        <p className="text-sm text-slate-300 leading-relaxed">
          Spending as % of GDP ({govSpending.asShareOfGdp}%) appears low because Ireland&apos;s GDP is inflated by multinationals. Measured against GNI* (the true domestic economy), government spending is <strong className="text-white">{govSpending.asShareOfGniStar}%</strong> — in line with European norms.
        </p>
      </div>

      <p className="text-xs text-slate-500">Source: CSO Government Finance Statistics 2024 · Department of Finance Budget 2025 · IFAC Fiscal Assessment Report 2026</p>
    </div>
  );
}
