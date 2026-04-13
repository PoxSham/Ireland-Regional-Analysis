'use client';

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { irishRegions, infraWeights } from '../data';

export default function InfrastructureBreakdown({ selectedId }) {
  const region = irishRegions.find(r => r.id === selectedId) || irishRegions[0];

  const radarData = Object.entries(infraWeights).map(([key, meta]) => ({
    dimension: meta.label,
    score: region.infraBreakdown[key] || 0,
    weight: meta.weight,
    source: meta.source,
  }));

  const weightedScore = radarData.reduce((sum, d) => sum + (d.score * d.weight / 100), 0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">{region.name}</h3>
            <p className="text-xs text-slate-400">Infrastructure Composite Score: <span className="text-emerald-400 font-bold">{region.infraScore}/100</span></p>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: region.color + '20', color: region.color }}>
            {region.infraLabel}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} />
            <Radar dataKey="score" stroke={region.color} fill={region.color} fillOpacity={0.25} />
            <Tooltip formatter={(v) => [`${v}/100`, 'Score']} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Dimension breakdown */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="font-bold mb-4">Scoring Methodology & Weights</h3>
        <div className="space-y-4">
          {radarData.map(d => (
            <div key={d.dimension} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{d.dimension}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{d.weight}% weight</span>
                  <span className="font-bold">{d.score}/100</span>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="h-2 rounded-full transition-all" style={{ width: `${d.score}%`, backgroundColor: d.score >= 70 ? '#10b981' : d.score >= 50 ? '#f59e0b' : '#ef4444' }} />
              </div>
              <p className="text-xs text-slate-500">Source: {d.source}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-slate-700/40 rounded-lg text-xs text-slate-400">
          <strong className="text-slate-200">Weighted composite: {weightedScore.toFixed(1)}/100</strong> — calculated from grid capacity (30%), housing delivery (25%), water infrastructure (20%), transport connectivity (15%), and broadband rollout (10%).
        </div>
      </div>

      {/* All regions comparison */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700">
              <th className="px-5 py-3 text-left">Region</th>
              <th className="px-4 py-3 text-center text-xs">Grid<br/><span className="text-slate-500">30%</span></th>
              <th className="px-4 py-3 text-center text-xs">Housing<br/><span className="text-slate-500">25%</span></th>
              <th className="px-4 py-3 text-center text-xs">Water<br/><span className="text-slate-500">20%</span></th>
              <th className="px-4 py-3 text-center text-xs">Transport<br/><span className="text-slate-500">15%</span></th>
              <th className="px-4 py-3 text-center text-xs">Broadband<br/><span className="text-slate-500">10%</span></th>
              <th className="px-4 py-3 text-center font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {irishRegions.map(r => (
              <tr key={r.id} className={`border-b border-slate-700/50 transition-colors ${r.id === selectedId ? 'bg-slate-700/30' : 'hover:bg-slate-700/10'}`}>
                <td className="px-5 py-3 font-medium text-xs">{r.shortName}</td>
                {['grid','housing','water','transport','broadband'].map(k => {
                  const v = r.infraBreakdown[k];
                  return (
                    <td key={k} className="px-4 py-3 text-center text-xs">
                      <span className={`font-bold ${v >= 70 ? 'text-green-400' : v >= 50 ? 'text-yellow-400' : v >= 30 ? 'text-orange-400' : 'text-red-400'}`}>{v}</span>
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-center">
                  <span className="font-bold" style={{ color: r.color }}>{r.infraScore}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
