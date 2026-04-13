'use client';

import { useState, useRef, useEffect } from 'react';

// ── Verified data sources ────────────────────────────────────────────────────
// X-axis: GDP per capita in PPS (Purchasing Power Standards, € equivalent)
//   EU countries: Eurostat nama_10_pc, 2023. Index (EU27=100) × EU avg (38,100 PPS).
//   EU avg (38,100 PPS): https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251020-1
//   Country indices: Eurostat Statistics Explained "National accounts and GDP" 2023 edition
//   Irish NUTS3: Dublin 139,500 PPS & South-West 137,300 PPS from Eurostat NUTS3 release (2023)
//   Other Irish NUTS3: derived from CSO GVA 2024 × Ireland PPS/GVA ratio (labelled est.)
//
// Y-axis: Unemployment rate (%), annual average 2024
//   Source: Eurostat [une_rt_a] — https://ec.europa.eu/eurostat/databrowser/product/page/UNE_RT_A

const EU_AVG_PPS = 38100;   // PPS, 2023 Eurostat
const EU_AVG_UNEMP = 5.9;   // %, 2024 Eurostat [une_rt_a]

// EU countries — GDP per capita PPS 2023, unemployment 2024
// PPS = (index / 100) × 38,100; rounded to nearest 100
const EU_COUNTRIES = [
  { name: 'Luxembourg',  pps: 91100, unemp: 5.5,  group: 'west'  },
  { name: 'Netherlands', pps: 49500, unemp: 3.7,  group: 'west'  },
  { name: 'Denmark',     pps: 49500, unemp: 5.0,  group: 'north' },
  { name: 'Austria',     pps: 48400, unemp: 5.3,  group: 'west'  },
  { name: 'Germany',     pps: 46500, unemp: 3.4,  group: 'west'  },
  { name: 'Sweden',      pps: 46500, unemp: 8.5,  group: 'north' },
  { name: 'Belgium',     pps: 45700, unemp: 5.6,  group: 'west'  },
  { name: 'Finland',     pps: 42700, unemp: 7.5,  group: 'north' },
  { name: 'Malta',       pps: 40000, unemp: 3.2,  group: 'south' },
  { name: 'France',      pps: 38500, unemp: 7.3,  group: 'west'  },
  { name: 'Italy',       pps: 37000, unemp: 6.7,  group: 'south' },
  { name: 'Cyprus',      pps: 36200, unemp: 5.0,  group: 'south' },
  { name: 'Czechia',     pps: 34700, unemp: 2.7,  group: 'east'  },
  { name: 'Slovenia',    pps: 34300, unemp: 3.6,  group: 'east'  },
  { name: 'Spain',       pps: 33500, unemp: 11.4, group: 'south' },
  { name: 'Lithuania',   pps: 32400, unemp: 6.9,  group: 'east'  },
  { name: 'Estonia',     pps: 31200, unemp: 7.3,  group: 'east'  },
  { name: 'Portugal',    pps: 30500, unemp: 6.4,  group: 'south' },
  { name: 'Poland',      pps: 29300, unemp: 3.0,  group: 'east'  },
  { name: 'Croatia',     pps: 28200, unemp: 5.2,  group: 'east'  },
  { name: 'Hungary',     pps: 27400, unemp: 4.5,  group: 'east'  },
  { name: 'Romania',     pps: 27400, unemp: 5.6,  group: 'east'  },
  { name: 'Slovakia',    pps: 27100, unemp: 5.8,  group: 'east'  },
  { name: 'Latvia',      pps: 25900, unemp: 6.5,  group: 'east'  },
  { name: 'Greece',      pps: 25500, unemp: 11.1, group: 'south' },
  { name: 'Bulgaria',    pps: 24400, unemp: 4.2,  group: 'east'  },
];

// Irish NUTS3 regions — GDP per capita in PPS 2023
// Dublin & South-West: published directly by Eurostat NUTS3 release (Oct 2025)
// Other regions: derived from CSO GVA 2024 × Ireland PPS/GVA conversion ratio
// Ireland national: PPS index 213 × 38,100 / 100 = 81,153 PPS
// Ireland GVA national: 99,513 € → ratio ≈ 0.816
// NB: MNC distortion is partly price-adjusted in PPS but structural distortion remains.
const IRISH_PPS = {
  'dublin':    { pps: 139500, estimated: false },  // Eurostat NUTS3 2023 (published)
  'southwest': { pps: 137300, estimated: false },  // Eurostat NUTS3 2023 (published)
  'west':      { pps: 46500,  estimated: true  },  // derived: CSO GVA 2024 × IE PPS ratio
  'mideast':   { pps: 42000,  estimated: true  },  // derived: CSO GVA 2024 × IE PPS ratio
  'southeast': { pps: 35100,  estimated: true  },  // derived: CSO GVA 2024 × IE PPS ratio
  'midlands':  { pps: 31200,  estimated: true  },  // derived: CSO GVA 2024 × IE PPS ratio
  'northwest': { pps: 25300,  estimated: true  },  // derived: Border region; CSO GVA 2024 × IE PPS ratio
};

const GROUP_COLORS = {
  west:  '#6B9FBF',
  north: '#7BAAA8',
  south: '#C49A6C',
  east:  '#A0A89E',
};

const IRISH_COLOR = '#0D6B4F';
const PADDING = { top: 28, right: 136, bottom: 58, left: 72 };

function lerp(v, inMin, inMax, outMin, outMax) {
  return ((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

export default function ScatterPlot({ regions }) {
  const [active, setActive] = useState(null);
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

  // Axis ranges — PPS up to 150k, unemployment 0–13%
  const xMin = 15000, xMax = 150000;
  const yMin = 0,     yMax = 13;

  const toX = v => lerp(v, xMin, xMax, 0, plotW);
  const toY = v => lerp(v, yMin, yMax, plotH, 0);

  // Clean tick values for PPS axis
  const xTicks = [20000, 40000, 60000, 80000, 100000, 120000, 140000];
  const yTicks = [2, 4, 6, 8, 10, 12];

  // Reference lines
  const euAvgX = toX(EU_AVG_PPS);
  const euAvgY = toY(EU_AVG_UNEMP);

  // Ireland national PPS (213% of EU avg 2023) — for context
  const irelandNationalX = toX(81200);

  // Build Irish region points using IRISH_PPS lookup
  const irishPoints = regions.map(r => {
    const ppsData = IRISH_PPS[r.id];
    const pps = ppsData ? ppsData.pps : Math.round((r.gvaNominal2024 || 0) * 0.816 / 100) * 100;
    const estimated = ppsData ? ppsData.estimated : true;
    return { ...r, pps, estimated };
  });

  return (
    <div ref={containerRef} style={{ width: '100%', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Chart ── */}
      <svg
        width={w}
        height={h}
        style={{ overflow: 'visible', display: 'block' }}
        aria-label="GDP per capita (PPS) vs unemployment rate — Irish regions and EU countries"
      >
        <defs>
          <clipPath id="sp-clip">
            <rect x={0} y={0} width={plotW + 4} height={plotH + 4} />
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
          <text x={euAvgX + 4} y={10} fill="#A8A69F" fontSize={9.5} fontWeight={500}>EU avg (38,100)</text>
          <text x={4} y={euAvgY - 4} fill="#A8A69F" fontSize={9.5} fontWeight={500}>EU avg unemp. 5.9%</text>

          {/* ── Ireland national PPS reference ── */}
          <line x1={irelandNationalX} x2={irelandNationalX} y1={0} y2={plotH}
            stroke="#0D6B4F" strokeWidth={1} strokeDasharray="4 3" opacity={0.35} />
          <text x={irelandNationalX + 4} y={plotH - 6} fill="#0D6B4F" fontSize={8.5} opacity={0.55}>
            IE national (81,200)
          </text>

          {/* ── X Axis ── */}
          {xTicks.map(v => (
            <g key={`xt-${v}`} transform={`translate(${toX(v)},${plotH})`}>
              <line y2={4} stroke="#C5BFB8" />
              <text y={16} textAnchor="middle" fill="#6B6860" fontSize={10}>
                {Math.round(v / 1000)}k
              </text>
            </g>
          ))}
          <text x={plotW / 2} y={plotH + 46} textAnchor="middle"
            fill="#4A4740" fontSize={11.5} fontWeight={600}>
            GDP per Capita (PPS, €) — Eurostat 2023
          </text>

          {/* ── Y Axis ── */}
          {yTicks.map(v => (
            <g key={`yt-${v}`} transform={`translate(0,${toY(v)})`}>
              <line x2={-4} stroke="#C5BFB8" />
              <text x={-8} dy="0.35em" textAnchor="end" fill="#6B6860" fontSize={10.5}>{v}%</text>
            </g>
          ))}
          <text
            transform={`translate(-54,${plotH / 2}) rotate(-90)`}
            textAnchor="middle" fill="#4A4740" fontSize={11.5} fontWeight={600}>
            Unemployment Rate (%) — 2024
          </text>

          {/* ── Data points ── */}
          <g clipPath="url(#sp-clip)">

            {/* EU countries */}
            {EU_COUNTRIES.map(c => {
              const cx = toX(c.pps);
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

            {/* Irish regions */}
            {irishPoints.map(r => {
              const cx = toX(r.pps);
              const cy = toY(r.unemployment2024);
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
                    <circle r={13} fill={IRISH_COLOR} fillOpacity={0.10} stroke={IRISH_COLOR}
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
                    {r.shortName}{r.estimated ? ' *' : ''}
                  </text>
                </g>
              );
            })}

          </g>
        </g>
      </svg>

      {/* ── Info card ── */}
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
                <span>
                  GDP per capita (PPS):&nbsp;
                  <strong>{active.data.pps.toLocaleString()} PPS</strong>
                  {active.data.estimated && <span style={{ color: '#A8A69F' }}> (est.)</span>}
                </span>
                <span>Unemployment: <strong>{active.data.unemployment2024}%</strong></span>
                <span style={{ color: '#A8A69F', fontSize: 12 }}>
                  {active.data.estimated
                    ? 'PPS est. from CSO GVA 2024 × Ireland PPS ratio · Unemployment: CSO LFS 2024'
                    : 'Eurostat NUTS3 2023 · Unemployment: CSO LFS 2024'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{active.data.name}</div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', color: '#4A4740' }}>
                <span>GDP per capita (PPS): <strong>{active.data.pps.toLocaleString()} PPS</strong></span>
                <span>Unemployment: <strong>{active.data.unemp}%</strong></span>
                <span style={{ color: '#A8A69F', fontSize: 12 }}>
                  Eurostat nama_10_pc 2023 · Unemployment: Eurostat une_rt_a 2024
                </span>
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
          { label: 'Western EU', key: 'west' },
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
          <div style={{ width: 16, height: 1, borderTop: '1.5px dashed #B0ABA4' }} />
          <span>EU averages</span>
        </div>
      </div>

      <p style={{ marginTop: 10, fontSize: 11, color: '#A8A69F', lineHeight: 1.55 }}>
        Tap or hover a point for details. &nbsp;
        <strong style={{ color: '#6B6860' }}>X-axis:</strong> GDP per capita in PPS (Purchasing Power Standards) —
        EU countries from Eurostat nama_10_pc 2023; Dublin &amp; South-West from Eurostat NUTS3 PPS release 2023;
        other Irish regions derived from CSO GVA 2024 × Ireland PPS/GVA conversion ratio (marked *). &nbsp;
        <strong style={{ color: '#6B6860' }}>Y-axis:</strong> Unemployment rate, annual average 2024
        (Eurostat [une_rt_a]; CSO LFS 2024 for Irish regions). &nbsp;
        Note: Ireland's national PPS (81,200) sits well above the EU average due to MNC activity;
        regional PPS figures are less distorted as they reflect where economic activity physically occurs.
        Source: <a href="https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251020-1"
          target="_blank" rel="noreferrer" style={{ color: '#0D6B4F' }}>Eurostat NUTS3 2023</a>;{' '}
        <a href="https://ec.europa.eu/eurostat/statistics-explained/index.php?title=National_accounts_and_GDP"
          target="_blank" rel="noreferrer" style={{ color: '#0D6B4F' }}>Eurostat National Accounts 2023</a>.
      </p>
    </div>
  );
}
