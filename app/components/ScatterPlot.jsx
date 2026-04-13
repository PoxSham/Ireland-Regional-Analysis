'use client';

import { useState, useRef, useEffect } from 'react';

// ── Verified data: Eurostat Annual Unemployment Rates 2024 ─────────────────
// Source: Eurostat [une_rt_a], annual averages 2024
const EU_COUNTRIES = [
  { name: 'Luxembourg',   gva: 125000, unemp: 5.5,  group: 'west' },
  { name: 'Netherlands',  gva: 72000,  unemp: 3.7,  group: 'west' },
  { name: 'Denmark',      gva: 70000,  unemp: 5.0,  group: 'west' },
  { name: 'Austria',      gva: 68000,  unemp: 5.3,  group: 'west' },
  { name: 'Germany',      gva: 62000,  unemp: 3.4,  group: 'west' },
  { name: 'Belgium',      gva: 56000,  unemp: 5.6,  group: 'west' },
  { name: 'France',       gva: 58000,  unemp: 7.3,  group: 'west' },
  { name: 'Sweden',       gva: 58000,  unemp: 8.5,  group: 'north' },
  { name: 'Finland',      gva: 52000,  unemp: 7.5,  group: 'north' },
  { name: 'Spain',        gva: 32000,  unemp: 11.4, group: 'south' },
  { name: 'Italy',        gva: 35000,  unemp: 6.7,  group: 'south' },
  { name: 'Greece',       gva: 22000,  unemp: 11.1, group: 'south' },
  { name: 'Portugal',     gva: 25000,  unemp: 6.4,  group: 'south' },
  { name: 'Slovenia',     gva: 36000,  unemp: 3.6,  group: 'east' },
  { name: 'Czechia',      gva: 32000,  unemp: 2.7,  group: 'east' },
  { name: 'Poland',       gva: 22000,  unemp: 3.0,  group: 'east' },
  { name: 'Hungary',      gva: 22000,  unemp: 4.5,  group: 'east' },
  { name: 'Romania',      gva: 17000,  unemp: 5.6,  group: 'east' },
  { name: 'Bulgaria',     gva: 15000,  unemp: 4.2,  group: 'east' },
];

const GROUP_COLORS = {
  west:  '#6B9FBF',  // muted blue
  north: '#7BAAA8',  // muted teal
  south: '#C49A6C',  // muted amber
  east:  '#A0A89E',  // muted slate
};

const IRISH_COLOR = '#0D6B4F';
const PADDING = { top: 28, right: 130, bottom: 56, left: 68 };

function lerp(v, inMin, inMax, outMin, outMax) {
  return ((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

export default function ScatterPlot({ regions }) {
  const [active, setActive] = useState(null);   // { data, type }
  const [dims, setDims] = useState({ w: 760, h: 460 });
  const containerRef = useRef(null);

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      setDims({ w: width, h: Math.max(320, Math.min(520, width * 0.62)) });
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;
  const plotW = w - PADDING.left - PADDING.right;
  const plotH = h - PADDING.top - PADDING.bottom;

  // Axis ranges — GVA up to 185k, unemployment 0–13%
  const xMin = 10000, xMax = 185000;
  const yMin = 0,     yMax = 13;

  const toX = v => lerp(v, xMin, xMax, 0, plotW);
  const toY = v => lerp(v, yMin, yMax, plotH, 0);

  const xTicks = [20000, 40000, 60000, 80000, 100000, 130000, 160000];
  const yTicks = [2, 4, 6, 8, 10, 12];

  // EU avg reference lines
  const euAvgX = toX(37610);   // Eurostat 2024 EU avg GDP per capita
  const euAvgY = toY(5.9);     // Eurostat 2024 EU avg unemployment

  // Irish national reference (GNI* per capita is more honest)
  const irelandGniX = toX(59463);

  return (
    <div ref={containerRef} style={{ width: '100%', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Chart ── */}
      <svg
        width={w}
        height={h}
        style={{ overflow: 'visible', display: 'block' }}
        aria-label="GVA per capita vs unemployment rate scatter plot"
      >
        <defs>
          <clipPath id="sp-clip">
            <rect x={0} y={0} width={plotW + 2} height={plotH + 2} />
          </clipPath>
        </defs>

        <g transform={`translate(${PADDING.left},${PADDING.top})`}>

          {/* ── Grid lines ── */}
          {xTicks.map(v => (
            <line key={`gx-${v}`} x1={toX(v)} x2={toX(v)} y1={0} y2={plotH}
              stroke="#EDEAE4" strokeWidth={1} />
          ))}
          {yTicks.map(v => (
            <line key={`gy-${v}`} x1={0} x2={plotW} y1={toY(v)} y2={toY(v)}
              stroke="#EDEAE4" strokeWidth={1} />
          ))}

          {/* ── EU average reference lines ── */}
          <line x1={euAvgX} x2={euAvgX} y1={0} y2={plotH}
            stroke="#B0ABA4" strokeWidth={1.5} strokeDasharray="6 3" />
          <line x1={0} x2={plotW} y1={euAvgY} y2={euAvgY}
            stroke="#B0ABA4" strokeWidth={1.5} strokeDasharray="6 3" />

          {/* EU avg labels */}
          <text x={euAvgX + 4} y={8} fill="#A8A69F" fontSize={10} fontWeight={500}>EU avg GDP</text>
          <text x={4} y={euAvgY - 4} fill="#A8A69F" fontSize={10} fontWeight={500}>EU avg unemp. 5.9%</text>

          {/* ── Ireland GNI* reference line ── */}
          <line x1={irelandGniX} x2={irelandGniX} y1={0} y2={plotH}
            stroke="#0D6B4F" strokeWidth={1} strokeDasharray="4 3" opacity={0.4} />
          <text x={irelandGniX + 4} y={plotH - 6} fill="#0D6B4F" fontSize={9} opacity={0.6}>
            Ireland GNI*
          </text>

          {/* ── X Axis ── */}
          {xTicks.map(v => (
            <g key={`xt-${v}`} transform={`translate(${toX(v)},${plotH})`}>
              <line y2={4} stroke="#C5BFB8" />
              <text y={16} textAnchor="middle" fill="#6B6860" fontSize={10.5}>
                €{v >= 1000 ? Math.round(v / 1000) + 'k' : v}
              </text>
            </g>
          ))}
          <text x={plotW / 2} y={plotH + 44} textAnchor="middle"
            fill="#4A4740" fontSize={11.5} fontWeight={600}>
            GVA per Capita (€, approx.)
          </text>

          {/* ── Y Axis ── */}
          {yTicks.map(v => (
            <g key={`yt-${v}`} transform={`translate(0,${toY(v)})`}>
              <line x2={-4} stroke="#C5BFB8" />
              <text x={-8} dy="0.35em" textAnchor="end" fill="#6B6860" fontSize={10.5}>{v}%</text>
            </g>
          ))}
          <text
            transform={`translate(-50,${plotH / 2}) rotate(-90)`}
            textAnchor="middle" fill="#4A4740" fontSize={11.5} fontWeight={600}>
            Unemployment Rate (%)
          </text>

          {/* ── Data points ── */}
          <g clipPath="url(#sp-clip)">

            {/* EU countries — small coloured dots, label beside */}
            {EU_COUNTRIES.map(c => {
              const cx = toX(c.gva);
              const cy = toY(c.unemp);
              const isActive = active?.data?.name === c.name;
              return (
                <g
                  key={c.name}
                  transform={`translate(${cx},${cy})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActive(active?.data?.name === c.name ? null : { data: c, type: 'eu' })}
                  onMouseEnter={() => setActive({ data: c, type: 'eu' })}
                  onMouseLeave={() => setActive(null)}
                >
                  <circle
                    r={isActive ? 7 : 5}
                    fill={GROUP_COLORS[c.group]}
                    fillOpacity={isActive ? 1 : 0.75}
                    stroke={isActive ? 'white' : 'none'}
                    strokeWidth={1.5}
                  />
                  <text
                    x={7}
                    dy="0.35em"
                    fill={isActive ? '#1A1916' : '#7A7570'}
                    fontSize={isActive ? 10.5 : 9.5}
                    fontWeight={isActive ? 600 : 400}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {c.name}
                  </text>
                </g>
              );
            })}

            {/* Irish regions — larger solid green dots, name beside */}
            {regions.map(r => {
              const cx = toX(r.gva[2024]);
              const cy = toY(r.unemployment[2024]);
              const isActive = active?.data?.id === r.id;
              return (
                <g
                  key={r.id}
                  transform={`translate(${cx},${cy})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActive(active?.data?.id === r.id ? null : { data: r, type: 'irish' })}
                  onMouseEnter={() => setActive({ data: r, type: 'irish' })}
                  onMouseLeave={() => setActive(null)}
                >
                  {isActive && (
                    <circle r={13} fill={IRISH_COLOR} fillOpacity={0.12} stroke={IRISH_COLOR}
                      strokeWidth={1.5} strokeDasharray="3 2" />
                  )}
                  <circle
                    r={isActive ? 9 : 7}
                    fill={IRISH_COLOR}
                    fillOpacity={isActive ? 1 : 0.85}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                  <text
                    x={11}
                    dy="0.35em"
                    fill={IRISH_COLOR}
                    fontSize={isActive ? 11 : 10}
                    fontWeight={700}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {r.shortName}
                  </text>
                </g>
              );
            })}

          </g>
        </g>
      </svg>

      {/* ── Info card — shows on hover/tap ── */}
      {active && (
        <div style={{
          margin: '12px 0 0',
          padding: '14px 18px',
          background: '#F9F8F4',
          border: '1px solid #E2DFD8',
          borderRadius: 10,
          fontSize: 13,
          lineHeight: 1.6,
          color: '#1A1916',
        }}>
          {active.type === 'irish' ? (
            <>
              <div style={{ fontWeight: 700, marginBottom: 4, color: IRISH_COLOR }}>
                {active.data.name}
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', color: '#4A4740' }}>
                <span>GVA per capita: <strong>€{active.data.gva[2024].toLocaleString()}</strong></span>
                <span>Unemployment: <strong>{active.data.unemployment[2024]}%</strong></span>
                <span>Source: <span style={{ color: '#A8A69F' }}>CSO 2024</span></span>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{active.data.name}</div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', color: '#4A4740' }}>
                <span>GVA per capita: <strong>~€{active.data.gva.toLocaleString()}</strong></span>
                <span>Unemployment: <strong>{active.data.unemp}%</strong></span>
                <span>Source: <span style={{ color: '#A8A69F' }}>Eurostat 2024</span></span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Legend ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px 20px',
        marginTop: active ? 10 : 14,
        fontSize: 12, color: '#6B6860',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: IRISH_COLOR }} />
          <span style={{ fontWeight: 600, color: '#1A1916' }}>Irish Regions</span>
        </div>
        {[
          { label: 'Western/Northern EU', key: 'west' },
          { label: 'Northern EU', key: 'north' },
          { label: 'Southern EU', key: 'south' },
          { label: 'Eastern EU', key: 'east' },
        ].map(({ label, key }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: GROUP_COLORS[key] }} />
            <span>{label}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 16, height: 1, background: '#B0ABA4', borderTop: '1.5px dashed #B0ABA4' }} />
          <span>EU average</span>
        </div>
      </div>

      <p style={{ marginTop: 10, fontSize: 11, color: '#A8A69F', lineHeight: 1.5 }}>
        Tap or hover a point for details. Irish region GVA: CSO County Incomes and GDP 2024.
        Irish region unemployment: CSO LFS 2024. EU country GVA: Eurostat national accounts 2023–2024 (approximated).
        EU unemployment: Eurostat [une_rt_a] annual average 2024. EU country GVA figures are rounded estimates —
        for precise PPS comparisons see <a href="https://ec.europa.eu/eurostat" target="_blank" rel="noreferrer"
        style={{ color: '#0D6B4F' }}>ec.europa.eu/eurostat</a>.
      </p>
    </div>
  );
}
