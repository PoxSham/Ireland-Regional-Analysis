'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { taxRevenue } from '../data';

export default function TaxBreakdown() {
  const breakdownSorted = [...taxRevenue.breakdown2024].sort((a, b) => b.amount - a.amount);

  const ctYears = Object.keys(taxRevenue.ctHistory).map(Number);
  const ctChartData = ctYears.map(y => ({ year: y, ct: taxRevenue.ctHistory[y] }));

  const ct = taxRevenue.ctConcentration;

  const BreakdownTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs">
        <p className="font-bold text-white">{d.tax}</p>
        <p className="text-slate-300">€{d.amount}bn ({d.pct}% of total)</p>
      </div>
    );
  };

  const CTTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs">
        <p className="font-bold text-white">{label}</p>
        <p className="text-red-400">€{payload[0].value}bn</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Tax Revenue 2024</h2>

      {/* Horizontal bar chart of tax breakdown */}
      <div className="rounded-2xl border p-6" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
        <h3 className="font-bold text-white mb-1">Tax Revenue Breakdown (€bn, 2024)</h3>
        <p className="text-xs text-slate-400 mb-4">Total: €{(taxRevenue.total2024 / 1000).toFixed(0)}bn. Income tax and corporation tax together account for 46% of all revenue.</p>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={breakdownSorted} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `€${v}bn`} />
            <YAxis type="category" dataKey="tax" tick={{ fontSize: 10, fill: '#94a3b8' }} width={150} />
            <Tooltip content={<BreakdownTooltip />} />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: v => `€${v}bn`, fontSize: 11, fill: '#94a3b8' }}>
              {breakdownSorted.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Corporation Tax Concentration Warning */}
      <div className="rounded-xl border p-5" style={{ borderColor: '#ef4444', background: 'rgba(239,68,68,0.08)' }}>
        <h4 className="font-bold text-red-400 mb-3">Corporation Tax Concentration Risk</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Top 3 Companies', value: `${ct.top3Share}%`, sub: 'of all CT revenue' },
            { label: 'Top 10 Companies', value: `${ct.top10Share}%`, sub: 'of all CT revenue' },
            { label: 'Foreign MNCs', value: `${ct.foreignMncShare}%`, sub: 'of CT from foreign firms' },
            { label: 'CT Share of Tax', value: `${ct.ctAsShareOfTotal}%`, sub: 'of total tax revenue' },
          ].map(k => (
            <div key={k.label} className="rounded-lg p-3 text-center" style={{ background: 'rgba(13,43,24,0.6)' }}>
              <div className="text-2xl font-bold text-red-400">{k.value}</div>
              <div className="text-xs text-slate-400 mt-1">{k.label}</div>
              <div className="text-xs text-slate-500">{k.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CT Growth Line Chart */}
      <div className="rounded-2xl border p-6" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
        <h3 className="font-bold text-white mb-1">Corporation Tax Revenue 2015–2024 (€bn)</h3>
        <p className="text-xs text-slate-400 mb-4">CT revenue quadrupled in a decade — driven by global profit-shifting into Ireland post-2018.</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={ctChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `€${v}bn`} domain={[0, 32]} />
            <Tooltip content={<CTTooltip />} />
            <Line type="monotone" dataKey="ct" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444' }} name="Corporation Tax" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-amber-400 mt-2 italic">The dramatic rise post-2018 reflects OECD BEPS reforms pushing MNCs to declare more profits in Ireland — this revenue is structurally volatile.</p>
      </div>

      {/* Explanatory text */}
      <div className="rounded-xl border p-5" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
        <p className="text-sm text-slate-300 leading-relaxed">
          88% of corporation tax is paid by foreign-owned multinationals. Just 3 companies (Apple, Microsoft, Eli Lilly) paid <strong className="text-white">46% of all corporation tax</strong> in 2024 — equivalent to the entire education budget. This extreme concentration creates a fiscal vulnerability: if even one major firm restructures, Ireland faces a multi-billion revenue shortfall.
        </p>
      </div>

      <p className="text-xs text-slate-500">Source: Revenue Commissioners Annual Report 2025 · CSO Tax Statistics 2024 · IFAC Fiscal Assessment Report 2026</p>
    </div>
  );
}
