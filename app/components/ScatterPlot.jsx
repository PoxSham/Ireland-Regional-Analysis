'use client';

import { useState, useRef, useEffect } from 'react';

const PADDING = { top: 40, right: 30, bottom: 60, left: 70 };

function lerp(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

export default function ScatterPlot({ regions, euCountries, onSelectRegion, selectedId, viewMode }) {
  const [tooltip, setTooltip] = useState(null);
  const [dims, setDims] = useState({ w: 800, h: 480 });
  const svgRef = useRef(null);

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      setDims({ w: width, h: Math.max(360, width * 0.55) });
    });
    if (svgRef.current) ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;
  const plotW = w - PADDING.left - PADDING.right;
  const plotH = h - PADDING.top - PADDING.bottom;

  const xMin = 15000, xMax = 195000;
  const yMin = 15, yMax = 100;

  const toX = v => lerp(v, xMin, xMax, 0, plotW);
  const toY = v => lerp(v, yMin, yMax, plotH, 0);

  // Quadrant lines
  const midX = toX(60000);
  const midY = toY(62);

  const quadrants = [
    { x: 2, y: 2,         label: 'Poor & Under-Served',     color: '#ef4444', align: 'start' },
    { x: midX + 8, y: 2,  label: 'Rich but Under-Built',    color: '#f97316', align: 'start' },
    { x: 2, y: midY + 14, label: 'Poor but Well-Served',    color: '#10b981', align: 'start' },
    { x: midX + 8, y: midY + 14, label: 'Rich & Well-Built', color: '#3b82f6', align: 'start' },
  ];

  const xTicks = [20000, 40000, 60000, 80000, 100000, 130000, 160000, 190000];
  const yTicks = [20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <div className="w-full select-none">
      <svg
        ref={svgRef}
        width={w}
        height={h}
        className="overflow-visible"
        aria-label="Wealth vs Infrastructure scatter plot"
      >
        <defs>
          <clipPath id="plot-clip">
            <rect x={0} y={0} width={plotW} height={plotH} />
          </clipPath>
        </defs>

        <g transform={`translate(${PADDING.left},${PADDING.top})`}>
          {/* Grid */}
          {xTicks.map(v => (
            <line key={v} x1={toX(v)} x2={toX(v)} y1={0} y2={plotH} stroke="#E2DFD8" strokeWidth={1} strokeDasharray="4 4" />
          ))}
          {yTicks.map(v => (
            <line key={v} x1={0} x2={plotW} y1={toY(v)} y2={toY(v)} stroke="#E2DFD8" strokeWidth={1} strokeDasharray="4 4" />
          ))}

          {/* Quadrant dividers */}
          <line x1={midX} x2={midX} y1={0} y2={plotH} stroke="#C5CCC9" strokeWidth={1.5} strokeDasharray="8 4" />
          <line x1={0} x2={plotW} y1={midY} y2={midY} stroke="#C5CCC9" strokeWidth={1.5} strokeDasharray="8 4" />

          {/* Quadrant labels */}
          {quadrants.map((q, i) => (
            <text key={i} x={q.x} y={q.y} fill={q.color} fontSize={11} fontWeight={600} opacity={0.7}>
              {q.label}
            </text>
          ))}

          {/* X Axis */}
          {xTicks.map(v => (
            <g key={v} transform={`translate(${toX(v)},${plotH})`}>
              <line y2={5} stroke="#A8A69F" />
              <text y={18} textAnchor="middle" fill="#6B6860" fontSize={11}>
                €{v >= 1000 ? (v / 1000) + 'k' : v}
              </text>
            </g>
          ))}
          <text x={plotW / 2} y={plotH + 48} textAnchor="middle" fill="#6B6860" fontSize={12} fontWeight={600}>
            GVA per Capita (€)
          </text>

          {/* Y Axis */}
          {yTicks.map(v => (
            <g key={v} transform={`translate(0,${toY(v)})`}>
              <line x2={-5} stroke="#A8A69F" />
              <text x={-10} dy="0.35em" textAnchor="end" fill="#6B6860" fontSize={11}>{v}</text>
            </g>
          ))}
          <text transform={`translate(-52,${plotH / 2}) rotate(-90)`} textAnchor="middle" fill="#6B6860" fontSize={12} fontWeight={600}>
            Infrastructure Score (0–100)
          </text>

          {/* EU Countries (muted, background) */}
          <g clipPath="url(#plot-clip)">
            {euCountries.map((c) => {
              const cx = toX(c.gvaPerCapita);
              const cy = toY(c.infraScore);
              return (
                <g
                  key={c.name}
                  transform={`translate(${cx},${cy})`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => setTooltip({ x: cx + PADDING.left, y: cy + PADDING.top, data: c, type: 'eu' })}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <circle r={7} fill="#C5CCC9" fillOpacity={0.6} stroke="#8BAF9E" strokeWidth={1} />
                  <text y={-10} textAnchor="middle" fill="#6B6860" fontSize={10} fontWeight={500}>
                    {c.name}
                  </text>
                </g>
              );
            })}

            {/* EU Average marker */}
            <g transform={`translate(${toX(42500)},${toY(72)})`}>
              <circle r={9} fill="none" stroke="#A8A69F" strokeWidth={2} strokeDasharray="4 2" />
              <text y={-12} textAnchor="middle" fill="#6B6860" fontSize={10} fontWeight={600}>EU Avg</text>
            </g>

            {/* Irish Regions (bold, foreground) */}
            {regions.map((r) => {
              const cx = toX(r.gva[2024]);
              const cy = toY(r.infraScore);
              const isSelected = r.id === selectedId;
              return (
                <g
                  key={r.id}
                  transform={`translate(${cx},${cy})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectRegion(r.id)}
                  onMouseEnter={() => setTooltip({ x: cx + PADDING.left, y: cy + PADDING.top, data: r, type: 'irish' })}
                  onMouseLeave={() => setTooltip(null)}
                  role="button"
                  aria-label={`${r.name}: GVA €${r.gva[2024].toLocaleString()}, Infrastructure ${r.infraScore}`}
                  tabIndex={0}
                >
                  {isSelected && (
                    <circle r={22} fill={r.color} fillOpacity={0.15} stroke={r.color} strokeWidth={2} strokeDasharray="4 2">
                      <animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    r={isSelected ? 17 : 14}
                    fill={r.color}
                    fillOpacity={isSelected ? 1 : 0.85}
                    stroke="white"
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  <text
                    textAnchor="middle"
                    dy="0.35em"
                    fill="white"
                    fontSize={isSelected ? 10 : 9}
                    fontWeight={700}
                    style={{ pointerEvents: 'none' }}
                  >
                    {r.shortName.split(' ')[0].substring(0, 3).toUpperCase()}
                  </text>
                </g>
              );
            })}
          </g>
        </g>

        {/* Tooltip */}
        {tooltip && (
          <g transform={`translate(${Math.min(tooltip.x + 12, w - 200)},${Math.max(tooltip.y - 10, 10)})`}>
            <rect
              x={0} y={0}
              width={tooltip.type === 'irish' ? 200 : 180}
              height={tooltip.type === 'irish' ? 80 : 70}
              rx={8}
              fill="white"
              stroke="#E2DFD8"
              strokeWidth={1}
              filter="drop-shadow(0 2px 8px rgba(0,0,0,0.10))"
            />
            {tooltip.type === 'irish' ? (
              <>
                <text x={10} y={22} fill="#1A1916" fontSize={12} fontWeight={700}>{tooltip.data.shortName}</text>
                <text x={10} y={40} fill="#6B6860" fontSize={11}>GVA: €{tooltip.data.gva[2024].toLocaleString()}</text>
                <text x={10} y={56} fill="#6B6860" fontSize={11}>Infrastructure: {tooltip.data.infraScore}/100</text>
                <text x={10} y={72} fill="#6B6860" fontSize={11}>Unemployment: {tooltip.data.unemployment[2024]}%</text>
              </>
            ) : (
              <>
                <text x={10} y={22} fill="#1A1916" fontSize={12} fontWeight={700}>{tooltip.data.name}</text>
                <text x={10} y={40} fill="#6B6860" fontSize={11}>GDP: €{tooltip.data.gvaPerCapita.toLocaleString()}</text>
                <text x={10} y={56} fill="#6B6860" fontSize={11}>Infrastructure: {tooltip.data.infraScore}/100</text>
                <text x={10} y={70} fill="#A8A69F" fontSize={10}>Unemployment: {tooltip.data.unemployment}%</text>
              </>
            )}
          </g>
        )}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24, marginTop: 16, fontSize: 12, color: '#6B6860', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#0D6B4F' }} />
          <span>Irish Regions</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#C5CCC9' }} />
          <span>EU Countries (hover for details)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px dashed #A8A69F', boxSizing: 'border-box' }} />
          <span>EU Average</span>
        </div>
      </div>
    </div>
  );
}
