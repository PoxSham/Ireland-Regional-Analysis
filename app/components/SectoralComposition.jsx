'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { irishRegions } from '../data';

const sectorColors = {
  ict: '#3b82f6', manufacturing: '#10b981', professional: '#8b5cf6',
  public: '#f59e0b', services: '#06b6d4', industry: '#f97316',
  retail: '#ec4899', distribution: '#14b8a6', other: '#64748b',
};

const sectorLabels = {
  ict: 'ICT', manufacturing: 'Manufacturing', professional: 'Professional Services',
  public: 'Public/Health/Education', services: 'Services', industry: 'Industry',
  retail: 'Retail', distribution: 'Distribution', other: 'Other',
};

export default function SectoralComposition() {
  const [selectedRegionId, setSelectedRegionId] = useState('dublin');
  const chartData = irishRegions.map(r => ({
    name: r.shortName.split(' ')[0],
    ...r.sectors,
  }));

  const allSectors = [...new Set(irishRegions.flatMap(r => Object.keys(r.sectors)))];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs space-y-1 max-w-xs">
        <p className="font-bold text-white">{label}</p>
        {payload.map((p, i) => p.value > 0 && (
          <p key={i} style={{ color: p.fill }}>{sectorLabels[p.dataKey] || p.dataKey}: {p.value}%</p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Dublin ICT Dominance', value: '38%', sub: 'Of Dublin economic output', color: 'blue' },
          { label: 'SW Manufacturing', value: '74%', sub: 'South-West heavily reliant', color: 'emerald' },
          { label: 'North-West Diversity', value: 'Low', sub: 'Public sector dependent', color: 'amber' },
        ].map(s => (
          <div key={s.label} className={`bg-${s.color}-500/10 border border-${s.color}-500/30 rounded-xl p-4`}>
            <div className="text-xs text-slate-400 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="font-bold mb-1">Sectoral Composition by Region (% of GVA)</h3>
        <p className="text-xs text-slate-400 mb-6">Source: CSO County Incomes and Regional GDP 2024, Economic Sectors by Region</p>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
              formatter={(v) => <span style={{ color: '#94a3b8' }}>{sectorLabels[v] || v}</span>}
            />
            {allSectors.map(s => (
              <Bar key={s} dataKey={s} stackId="a" fill={sectorColors[s] || '#64748b'} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Region Detail Horizontal Bar */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold mb-1">Sector Breakdown — {irishRegions.find(r => r.id === selectedRegionId)?.shortName || 'Dublin'}</h3>
            <p className="text-xs text-slate-400">Select a region to see its sectoral composition</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {irishRegions.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegionId(r.id)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: selectedRegionId === r.id ? r.color : 'rgba(30,50,38,0.8)',
                  color: selectedRegionId === r.id ? '#fff' : '#94a3b8',
                  border: `1px solid ${selectedRegionId === r.id ? r.color : '#1a3a28'}`,
                }}
              >
                {r.shortName.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
        {(() => {
          const region = irishRegions.find(r => r.id === selectedRegionId);
          if (!region) return null;
          const sectorData = Object.entries(region.sectors)
            .map(([key, value]) => ({ name: sectorLabels[key] || key, value, color: sectorColors[key] || '#64748b' }))
            .sort((a, b) => b.value - a.value);
          return (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sectorData} layout="vertical" margin={{ top: 5, right: 40, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} width={140} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs">
                        <p className="font-bold text-white">{payload[0].payload.name}</p>
                        <p className="text-slate-300">{payload[0].value}% of GVA</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: v => `${v}%`, fontSize: 11, fill: '#94a3b8' }}>
                  {sectorData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          );
        })()}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h4 className="font-bold mb-3">Economic Concentration Risk</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            { region: 'Dublin', risk: 'Low–Medium', note: 'ICT/pharma dominance creates MNC dependency but high diversification within tech', color: 'yellow' },
            { region: 'South-West', risk: 'High', note: '74% manufacturing GVA — extreme single-sector exposure to global supply chain shocks', color: 'red' },
            { region: 'North-West & Midlands', risk: 'High', note: 'Public sector dependency (25%+) masks weak private sector growth', color: 'red' },
            { region: 'West', risk: 'Medium', note: 'Manufacturing + services mix offers some resilience; grid constraints limit diversification', color: 'amber' },
          ].map(i => (
            <div key={i.region} className={`p-3 rounded-lg bg-${i.color}-500/10 border border-${i.color}-500/20`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{i.region}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full bg-${i.color}-500/20 text-${i.color}-400 font-semibold`}>Risk: {i.risk}</span>
              </div>
              <p className="text-xs text-slate-400">{i.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
