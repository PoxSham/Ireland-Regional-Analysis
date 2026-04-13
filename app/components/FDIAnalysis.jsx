'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { fdiData, investmentGapData } from '../data';

export default function FDIAnalysis() {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs">
        <p className="font-bold text-white">{d.name}</p>
        <p className="text-slate-300">FDI Share: <span className="text-emerald-400">{d.share}%</span></p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Eastern & Midland Share', value: '71%', sub: 'Dublin dominates', color: 'red' },
          { label: 'US Origin FDI', value: '69%', sub: 'Of all inward investment', color: 'blue' },
          { label: 'Top 25 Firms', value: '65%', sub: 'Concentration of FDI stock', color: 'amber' },
        ].map(s => (
          <div key={s.label} className={`bg-${s.color}-500/10 border border-${s.color}-500/30 rounded-xl p-4`}>
            <div className="text-xs text-slate-400 mb-1">{s.label}</div>
            <div className={`text-3xl font-bold text-${s.color}-400`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="font-bold mb-1">FDI Stock Distribution by Region</h3>
          <p className="text-xs text-slate-400 mb-4">Source: CSO Foreign Direct Investment 2023</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={fdiData.regional} dataKey="share" cx="50%" cy="50%" outerRadius={90} label={({ name, share }) => `${share}%`}>
                {fdiData.regional.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {fdiData.regional.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-slate-300">{d.name}</span>
                <span className="ml-auto font-bold" style={{ color: d.color }}>{d.share}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Investment gap */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="font-bold mb-1">NDP Investment per Capita by Region</h3>
          <p className="text-xs text-slate-400 mb-4">Source: National Development Plan 2021–2030, Budget 2025</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={investmentGapData} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} width={65} />
              <Tooltip formatter={(v) => [`€${v.toLocaleString()}`, 'Per Capita']} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="perCapita" radius={[0, 6, 6, 0]}>
                {investmentGapData.map((d, i) => (
                  <Cell key={i} fill={d.rating === 'Over-funded' ? '#10b981' : d.rating === 'Balanced' ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top firms */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h4 className="font-bold mb-3">Dublin's FDI Anchors</h4>
        <div className="flex flex-wrap gap-2">
          {fdiData.topFirms.map(f => (
            <span key={f} className="px-3 py-1.5 bg-blue-500/15 border border-blue-500/30 rounded-full text-sm font-semibold text-blue-300">{f}</span>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">{fdiData.note}</p>
      </div>
    </div>
  );
}
