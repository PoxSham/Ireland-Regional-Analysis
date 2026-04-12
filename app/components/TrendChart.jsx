'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function TrendChart({ region, extended = false }) {
  const data = Object.entries(region.gva).map(([year, value]) => ({
    year,
    gva: value,
    disposable: region.disposable[year],
    unemployment: region.unemployment[year],
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded text-xs text-slate-200 space-y-1">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Unemployment' ? `${entry.value.toFixed(1)}%` : `€${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12, fill: '#94a3b8' }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          label={{ value: 'GVA/Disposable (€)', angle: -90, position: 'insideLeft' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          label={{ value: 'Unemployment (%)', angle: 90, position: 'insideRight' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="gva"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981' }}
          name="GVA/Capita"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="disposable"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6' }}
          name="Disposable Income"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="unemployment"
          stroke="#f97316"
          strokeWidth={2}
          dot={{ fill: '#f97316' }}
          name="Unemployment"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
