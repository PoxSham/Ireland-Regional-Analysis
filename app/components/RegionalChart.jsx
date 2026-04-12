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

export default function RegionalChart({ regions, metric }) {
  const metricsConfig = {
    gva: {
      key: 'gva',
      label: 'GVA per Capita (€)',
      color: '#10b981',
    },
    disposable: {
      key: 'disposable',
      label: 'Disposable Income (€)',
      color: '#3b82f6',
    },
    unemployment: {
      key: 'unemployment',
      label: 'Unemployment Rate (%)',
      color: '#f97316',
    },
  };

  const config = metricsConfig[metric];
  const year = 2024;

  const data = regions.map(region => ({
    name: region.name.split('(')[0].trim(),
    [config.key]: metric === 'unemployment'
      ? region[config.key][year]
      : region[config.key][year],
    color: region.color,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const formatted = metric === 'unemployment'
        ? `${value.toFixed(1)}%`
        : `€${value.toLocaleString()}`;
      return (
        <div className="bg-slate-900 border border-slate-700 p-2 rounded text-xs text-slate-200">
          {formatted}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 12, fill: '#94a3b8' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          label={{ value: config.label, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={config.key} fill={config.color} radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
