'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { renewableData, nationalWindStats } from '../data';

const curtailmentColors = { 'Low': '#10b981', 'Medium': '#f59e0b', 'High': '#f97316', 'Critical': '#ef4444', 'N/A': '#64748b' };

export default function RenewableEnergy() {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs space-y-1">
        <p className="font-bold text-white">{d.region} ({d.county})</p>
        <p className="text-slate-300">Capacity: <span className="text-emerald-400">{d.capacity} MW</span></p>
        <p className="text-slate-300">Annual Output: <span className="text-blue-400">{d.annualGwh.toLocaleString()} GWh/yr</span></p>
        <p className="text-slate-300">National Share: <span className="text-yellow-400">{d.share}%</span></p>
        {d.gridConstrained && (
          <p className="text-red-400 font-semibold">⚠ Grid-Constrained</p>
        )}
        <p className="text-slate-400">Curtailment Risk: <span style={{ color: curtailmentColors[d.curtailmentRisk] }}>{d.curtailmentRisk}</span></p>
      </div>
    );
  };

  const sortedData = [...renewableData].sort((a, b) => b.capacity - a.capacity);

  return (
    <div className="space-y-6">
      {/* Headline stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'National Installed', value: `${(nationalWindStats.installedCapacity / 1000).toFixed(1)} GW`, color: 'emerald', sub: 'Onshore wind 2024' },
          { label: 'Annual Generation', value: `${(nationalWindStats.annualGwh / 1000).toFixed(0)} TWh`, color: 'blue', sub: '~33% of electricity' },
          { label: 'Grid Savings 2024', value: '€1.2B', color: 'green', sub: 'Fuel cost savings' },
          { label: '2030 Target Gap', value: `${nationalWindStats.targetGap} GW`, color: 'red', sub: 'Still needed' },
        ].map(s => (
          <div key={s.label} className={`bg-${s.color}-500/10 border border-${s.color}-500/30 rounded-xl p-4`}>
            <div className="text-xs text-slate-400 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="font-bold mb-1">Installed Wind Capacity by County (MW)</h3>
        <p className="text-xs text-slate-400 mb-6">Source: Wind Energy Ireland 2024 · Grid-constrained counties marked ⚠</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="county" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'MW', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="capacity" radius={[6, 6, 0, 0]}>
              {sortedData.map((d, i) => (
                <Cell key={i} fill={d.gridConstrained ? '#ef4444' : '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex gap-6 text-xs">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-500"/><span>Grid unconstrained</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-500"/><span>Grid constrained — cannot add capacity</span></div>
        </div>
      </div>

      {/* Policy callout */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
        <h4 className="font-bold text-amber-400 mb-2">The Grid Bottleneck Crisis</h4>
        <p className="text-sm text-slate-300 leading-relaxed">
          The West (Galway, Mayo) and North-West (Donegal) hold <strong className="text-white">40%+ of Ireland's wind potential</strong> but are severely grid-constrained — they cannot connect more turbines because transmission infrastructure into these regions is underdeveloped. Ireland's 2030 target of 9 GW onshore wind requires urgent grid investment in these areas. Without it, the transition to renewables will further deepen regional inequality.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
          {[
            { label: 'Donegal curtailment risk', value: 'Critical', color: 'red' },
            { label: 'Galway grid utilisation', value: 'At limit', color: 'orange' },
            { label: 'West potential unused', value: '>40%', color: 'amber' },
          ].map(i => (
            <div key={i.label} className="bg-slate-800/50 rounded-lg p-2 text-center">
              <div className={`text-${i.color}-400 font-bold`}>{i.value}</div>
              <div className="text-slate-400">{i.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
