'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const colorMap = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
};

export default function MetricCard({ label, value, change, trend, color = 'emerald' }) {
  const colors = colorMap[color];

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400';

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-xl p-5 backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </div>
        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
      </div>
      <div className={`text-2xl font-bold ${colors.text} mb-2`}>
        {value}
      </div>
      <div className={`text-xs ${trendColor} font-semibold`}>
        {change}
      </div>
    </div>
  );
}
