'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import ScatterPlot from './ScatterPlot';

const categoryColors = {
  highest: '#10b981',
  ireland: '#3b82f6',
  middle: '#f59e0b',
  lowest: '#ef4444',
};

export default function EuropeanComparison({ countries, averages, regions }) {
  const irelandandUniqueCountries = countries.filter(c => c.category !== 'ireland');

  const irelandEntry = countries.find(c => c.category === 'ireland');
  if (!irelandEntry) return <div className="text-red-400 p-4">Ireland data unavailable.</div>;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded text-xs text-slate-200">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p>GVA/Capita: €{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Scatter Plot */}
      {regions && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.6)', backdropFilter: 'blur(12px)' }}>
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-xl font-bold text-white">Wealth vs Infrastructure: Ireland &amp; Europe</h2>
            <p className="text-xs text-slate-400 mt-1">Click an Irish region to explore. Ireland sits in the <span className="text-orange-400 font-semibold">&quot;Rich but Under-Built&quot;</span> quadrant relative to EU peers.</p>
          </div>
          <div className="px-6 pb-6">
            <ScatterPlot
              regions={regions}
              euCountries={countries}
              onSelectRegion={() => {}}
              selectedId=""
              viewMode="region"
            />
          </div>
        </div>
      )}

      {/* GVA Comparison Chart */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-4">GVA per Capita (2024)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={countries}
            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={120}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              label={{ value: 'GVA per Capita (€)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="gvaPerCapita" fill="#3b82f6" radius={[8, 8, 0, 0]}>
              {countries.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={categoryColors[entry.category] || '#64748b'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#10b981' }} />
            <span>Highest Performers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3b82f6' }} />
            <span>Ireland (National)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#f59e0b' }} />
            <span>Middle Range</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ef4444' }} />
            <span>Lowest Performers</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
          <div className="text-sm text-slate-400 mb-2">Ireland vs EU Average</div>
          <div className="text-3xl font-bold text-emerald-400">
            +{((irelandEntry.gvaPerCapita / averages.gvaPerCapita - 1) * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Ireland: €{irelandEntry.gvaPerCapita.toLocaleString()}
            <br />
            EU Avg: €{averages.gvaPerCapita.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
          <div className="text-sm text-slate-400 mb-2">Highest: Luxembourg</div>
          <div className="text-3xl font-bold text-blue-400">€{Math.max(...countries.filter(c=>c.category!=='ireland').map(c=>c.gvaPerCapita)).toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-2">
            {((Math.max(...countries.filter(c=>c.category!=='ireland').map(c=>c.gvaPerCapita)) / irelandEntry.gvaPerCapita - 1) * 100).toFixed(0)}% higher than Ireland
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
          <div className="text-sm text-slate-400 mb-2">Lowest: Bulgaria</div>
          <div className="text-3xl font-bold text-red-400">€18,900</div>
          <div className="text-xs text-slate-400 mt-2">
            {((irelandEntry.gvaPerCapita / 18900 - 1) * 100).toFixed(0)}% below Ireland
          </div>
        </div>
      </div>

      {/* Country Details Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/50">
                <th className="px-6 py-4 text-left font-semibold">Country</th>
                <th className="px-6 py-4 text-right font-semibold">GVA/Capita</th>
                <th className="px-6 py-4 text-right font-semibold">Disposable Income</th>
                <th className="px-6 py-4 text-center font-semibold">Unemployment</th>
                <th className="px-6 py-4 text-left font-semibold">Category</th>
                <th className="px-6 py-4 text-left font-semibold">Key Sector</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold">{country.name}</td>
                  <td className="px-6 py-4 text-right">€{country.gvaPerCapita.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">€{country.disposableIncome.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">{country.unemployment}%</td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                      style={{
                        backgroundColor: categoryColors[country.category] + '25',
                        color: categoryColors[country.category],
                      }}
                    >
                      {country.category === 'ireland' ? 'Reference' : country.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs max-w-xs">{country.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="font-bold mb-3">European Context</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>• Ireland's national GVA per capita ranks among the top 3 in Europe, behind only Luxembourg and Netherlands</li>
          <li>• However, this masks significant regional disparities within Ireland</li>
          <li>• Ireland's prosperity is highly concentrated: Dublin region alone drives 41% of GDP with 23% of population</li>
          <li>• Even the poorest Irish region (North-West) has higher GVA/capita than Bulgaria, Greece, and Hungary</li>
          <li>• Infrastructure investments in peripheral regions could unlock significant growth potential</li>
          <li>• Ireland's unemployment (4.5%) is below EU average (5.8%), indicating strong labor market</li>
        </ul>
      </div>
    </div>
  );
}
