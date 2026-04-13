'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { macroIndicators } from '../data';

export default function MacroSnapshot() {
  const years = Object.keys(macroIndicators.gdpHistory).map(Number);
  const chartData = years.map(y => ({
    year: y,
    GDP: macroIndicators.gdpHistory[y],
    'GNI*': macroIndicators.gniHistory[y],
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs space-y-1">
        <p className="font-bold text-white">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: €{p.value}bn</p>
        ))}
        {payload.length === 2 && (
          <p className="text-slate-400 mt-1">Gap: €{(payload[0].value - payload[1].value)}bn</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* GDP vs GNI* Chart */}
      <div className="rounded-2xl border p-6" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
        <h3 className="text-lg font-bold text-white mb-1">GDP vs GNI* — The MNC Distortion</h3>
        <p className="text-xs text-slate-400 mb-4">GDP inflated by MNCs. GNI* strips out profit-shifting to show true domestic income.</p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `€${v}bn`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Line type="monotone" dataKey="GDP" stroke="#64748b" strokeWidth={2.5} dot={{ r: 3 }} name="GDP (inflated)" />
            <Line type="monotone" dataKey="GNI*" stroke="#169B62" strokeWidth={2.5} dot={{ r: 3 }} name="GNI* (true income)" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-amber-400 mt-3 italic">The growing gap between GDP and GNI* reflects increasing MNC profit-shifting through Ireland — GDP overstates the real economy by 75%.</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'GDP 2024', value: `€${macroIndicators.gdp2024.toLocaleString()}M`, sub: 'Headline figure', color: '#64748b' },
          { label: 'GNI* 2024', value: `€${macroIndicators.gni2024.toLocaleString()}M`, sub: 'True domestic income', color: '#169B62' },
          { label: 'GNI*/Capita', value: `€${macroIndicators.gniStarPerCapita.toLocaleString()}`, sub: 'Per person (real)', color: '#169B62' },
          { label: 'GVA/Capita', value: `€${macroIndicators.gdpPerCapita2024.toLocaleString()}`, sub: 'GDP-based (inflated)', color: '#64748b' },
        ].map(k => (
          <div key={k.label} className="rounded-xl border p-4" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
            <div className="text-xs text-slate-400 mb-1">{k.label}</div>
            <div className="text-xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs text-slate-500 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500">Source: CSO Annual National Accounts 2024 · IFAC Fiscal Assessment Report 2026</p>
    </div>
  );
}
