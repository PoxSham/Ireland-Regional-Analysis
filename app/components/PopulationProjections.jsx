'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { populationProjections, migrationData, irishRegions } from '../data';

const regionColors = {
  dublin: '#ef4444', mideast: '#eab308', southwest: '#f97316',
  west: '#06b6d4', southeast: '#06d6a0', northwest: '#0891b2', midlands: '#0e7490',
};

export default function PopulationProjections() {
  const migGrowth = migrationData.regions.map(r => ({
    ...r,
    color: regionColors[r.id] || '#64748b',
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs space-y-1">
        <p className="font-bold text-white">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {(p.value).toLocaleString()}k</p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Ireland 2042 (Central)', value: '5.78M', sub: '+12% from 2022', color: 'emerald' },
          { label: 'Mid-East Growth', value: '+22%', sub: 'Fastest growing region', color: 'yellow' },
          { label: 'North-West Change', value: '-11%', sub: 'Population declining', color: 'red' },
          { label: 'Over-65s by 2030', value: '1M+', sub: '+62% from today', color: 'orange' },
        ].map(s => (
          <div key={s.label} className={`bg-${s.color}-500/10 border border-${s.color}-500/30 rounded-xl p-4`}>
            <div className="text-xs text-slate-400 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="font-bold mb-1">Regional Population Projections 2022–2042 (thousands)</h3>
        <p className="text-xs text-slate-400 mb-6">Source: CSO Regional Population Projections, January 2025 (Central Scenario)</p>
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={populationProjections} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              {Object.entries(regionColors).map(([id, color]) => (
                <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
            {[
              ['dublin', 'Dublin'], ['mideast', 'Mid-East'], ['southwest', 'South-West'],
              ['west', 'West'], ['southeast', 'South-East'], ['northwest', 'North-West'], ['midlands', 'Midlands'],
            ].map(([id, label]) => (
              <Area key={id} type="monotone" dataKey={id} name={label} stroke={regionColors[id]} fill={`url(#grad-${id})`} strokeWidth={2} dot={false} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Population by Region with Migration Balance */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="font-bold mb-1">Population by Region with Migration Balance 2024</h3>
        <p className="text-xs text-slate-400 mb-6">Bar = population (thousands). Label = net migration balance. Regions losing people highlighted.</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={irishRegions.map(r => ({
              name: r.shortName,
              population: Math.round(r.population / 1000),
              migration: r.migrationBalance,
              color: r.color,
            })).sort((a, b) => b.population - a.population)}
            margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'Population (k)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs space-y-1">
                    <p className="font-bold text-white">{d.name}</p>
                    <p className="text-slate-300">Population: <span className="text-emerald-400">{d.population}k</span></p>
                    <p className={d.migration >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      Net Migration: {d.migration >= 0 ? '+' : ''}{d.migration.toLocaleString()}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="population" radius={[6, 6, 0, 0]}
              label={{
                position: 'top',
                formatter: (v, entry) => {
                  const d = irishRegions.find(r => Math.round(r.population / 1000) === v);
                  if (!d) return '';
                  const m = d.migrationBalance;
                  return m >= 0 ? `+${(m / 1000).toFixed(1)}k` : `${(m / 1000).toFixed(1)}k`;
                },
                fontSize: 10,
                fill: '#94a3b8',
              }}
            >
              {irishRegions
                .map(r => ({ color: r.color, pop: Math.round(r.population / 1000) }))
                .sort((a, b) => b.pop - a.pop)
                .map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Migration flows */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="font-bold mb-1">Net Internal Migration Balance by Region</h3>
        <p className="text-xs text-slate-400 mb-6">Source: CSO Population & Migration Estimates 2024. Positive = gaining people, Negative = losing people</p>
        <div className="space-y-3">
          {migGrowth.map(r => (
            <div key={r.id} className="flex items-center gap-4">
              <div className="w-28 text-xs text-slate-300 text-right flex-shrink-0">{r.name}</div>
              <div className="flex-1 relative h-6 flex items-center">
                <div className="absolute inset-x-0 top-1/2 -translate-y-px h-px bg-slate-600" />
                <div className="absolute left-1/2 w-px h-full bg-slate-500" />
                {r.netFlow >= 0 ? (
                  <div
                    className="absolute left-1/2 h-5 rounded-r"
                    style={{ width: `${Math.abs(r.netFlow) / 400}%`, backgroundColor: r.color, opacity: 0.8 }}
                  />
                ) : (
                  <div
                    className="absolute right-1/2 h-5 rounded-l"
                    style={{ width: `${Math.abs(r.netFlow) / 400}%`, backgroundColor: r.color, opacity: 0.8 }}
                  />
                )}
              </div>
              <div className={`w-16 text-xs font-bold text-right flex-shrink-0 ${r.netFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {r.netFlow >= 0 ? '+' : ''}{r.netFlow.toLocaleString()}
              </div>
              <div className="w-20 text-xs flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-full ${
                  r.brainDrainRisk === 'Low' ? 'bg-green-500/20 text-green-400' :
                  r.brainDrainRisk === 'Low-Med' ? 'bg-yellow-500/20 text-yellow-400' :
                  r.brainDrainRisk === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                  r.brainDrainRisk === 'High' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>{r.brainDrainRisk}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-slate-300">
          <strong className="text-red-400">Brain Drain:</strong> In 2025, 13,500 left Ireland for Australia — a 27% increase YoY and 187% above 2023. Over 53% were Irish citizens. Irish emigration shows "higher tendencies among females and younger age cohorts" during a period of strong economic growth — an unusual pattern indicating structural dissatisfaction beyond economics.
        </div>
      </div>
    </div>
  );
}
