'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { costOfLivingData } from '../data';

export default function CostOfLiving() {
  const sorted = [...costOfLivingData].sort((a, b) => b.rentToIncome - a.rentToIncome);
  const colors = { dublin: '#ef4444', mideast: '#eab308', southwest: '#f97316', southeast: '#06d6a0', west: '#06b6d4', northwest: '#0891b2', midlands: '#0e7490' };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs space-y-1">
        <p className="font-bold text-white">{d.name}</p>
        <p className="text-slate-300">Disposable Income: <span className="text-emerald-400">€{d.disposable.toLocaleString()}/yr</span></p>
        <p className="text-slate-300">Avg Rent: <span className="text-red-400">€{d.rent.toLocaleString()}/mo</span></p>
        <p className="text-slate-300">Rent-to-Income: <span className="text-amber-400">{d.rentToIncome}%</span></p>
        <p className="text-slate-300">After-rent monthly: <span className="text-blue-400">€{Math.round((d.disposable - d.rent * 12) / 12).toLocaleString()}</span></p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Dublin Rent/Income', value: '77%', sub: 'Rent alone consumes €2,186/mo', color: 'red' },
          { label: 'West Rent/Income', value: '54%', sub: 'More purchasing power', color: 'cyan' },
          { label: 'Dublin vs Donegal Rent', value: '+103%', sub: 'Dublin rent is double', color: 'amber' },
        ].map(s => (
          <div key={s.label} className={`bg-${s.color}-500/10 border border-${s.color}-500/30 rounded-xl p-4`}>
            <div className="text-xs text-slate-400 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="font-bold mb-1">Rent as % of Disposable Income by Region</h3>
        <p className="text-xs text-slate-400 mb-6">Source: RTB Rent Index Q2 2024, Daft.ie 2025, CSO Regional Incomes 2024</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sorted} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" height={80} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rentToIncome" name="Rent-to-Income %" radius={[6, 6, 0, 0]}>
              {sorted.map((d, i) => (
                <Cell key={i} fill={colors[d.id] || '#64748b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 text-xs text-slate-400">77% line = danger zone (Dublin). Below 60% = sustainable.</div>
      </div>

      {/* Real Purchasing Power after rent */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="font-bold mb-1">Real Purchasing Power After Rent (€/month)</h3>
        <p className="text-xs text-slate-400 mb-6">Disposable income minus annual rent, divided by 12. Shows what people actually have to spend each month.</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={[...costOfLivingData].sort((a, b) => b.realPurchasing - a.realPurchasing).map(d => ({
              ...d,
              monthlyAfterRent: Math.round(d.realPurchasing / 12),
            }))}
            margin={{ top: 5, right: 20, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `€${v}`} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs space-y-1">
                    <p className="font-bold text-white">{d.name}</p>
                    <p className="text-slate-300">Disposable: <span className="text-emerald-400">€{d.disposable.toLocaleString()}/yr</span></p>
                    <p className="text-slate-300">Rent: <span className="text-red-400">€{d.rent.toLocaleString()}/mo</span></p>
                    <p className="text-slate-300">After-rent monthly: <span className="text-blue-400">€{d.monthlyAfterRent.toLocaleString()}</span></p>
                  </div>
                );
              }}
            />
            <Bar dataKey="monthlyAfterRent" name="Monthly after rent" radius={[6, 6, 0, 0]}
              label={{ position: 'top', formatter: v => `€${v.toLocaleString()}`, fontSize: 10, fill: '#94a3b8' }}
            >
              {[...costOfLivingData].sort((a, b) => b.realPurchasing - a.realPurchasing).map((d, i) => (
                <Cell key={i} fill={colors[d.id] || '#64748b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-amber-400 mt-2 italic">Despite having the highest nominal incomes, Dublin residents have among the lowest real purchasing power after housing costs.</p>
      </div>

      {/* Purchasing power comparison */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="font-bold mb-4">Dublin vs Donegal — Real Purchasing Power After Rent</h3>
        <div className="grid grid-cols-2 gap-6">
          {[
            { name: 'Dublin', disposable: 33889, rent: 2186, color: '#ef4444' },
            { name: 'Border / Donegal', disposable: 25000, rent: 1185, color: '#0891b2' },
          ].map(r => {
            const monthly = Math.round(r.disposable / 12);
            const afterRent = monthly - r.rent;
            const pct = Math.round((r.rent / monthly) * 100);
            return (
              <div key={r.name} className="space-y-3">
                <div className="font-semibold" style={{ color: r.color }}>{r.name}</div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-slate-400">Monthly income</span><span className="font-bold">€{monthly.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Monthly rent</span><span className="text-red-400 font-bold">-€{r.rent.toLocaleString()}</span></div>
                  <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div className="h-4 rounded-full bg-red-500" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between font-bold border-t border-slate-600 pt-2">
                    <span className="text-slate-300">Left after rent</span>
                    <span className="text-emerald-400">€{afterRent.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-slate-500">Rent consumes {pct}% of monthly income</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-slate-300">
          <strong className="text-emerald-400">Key Insight:</strong> Dublin's nominal salary advantage is largely eaten by housing costs. After rent, a Donegal resident can have <strong className="text-white">competitive purchasing power</strong> versus a higher-earning Dublin worker.
        </div>
      </div>
    </div>
  );
}
