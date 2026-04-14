'use client';

import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import ScatterPlot from '../../components/ScatterPlot';
import regionsData from '../../data/regions.json';

export const dynamic = 'force-static';

const C_GREEN       = '#0D6B4F';
const C_GREEN_LIGHT = '#7FA896';
const C_STONE       = '#B5A899';
const C_AXIS        = '#6B6860';
const C_GRID        = '#F0EDE8';
const EU_AVG_PPS    = 38100;

// EU countries GDP per capita PPS 2023 — Eurostat nama_10_pc
const EU_BAR_DATA = [
  { name: 'Luxembourg',  pps: 91100 },
  { name: 'Ireland',     pps: 81200, isIreland: true },
  { name: 'Netherlands', pps: 49500 },
  { name: 'Denmark',     pps: 49500 },
  { name: 'Austria',     pps: 48400 },
  { name: 'Germany',     pps: 46500 },
  { name: 'Sweden',      pps: 46500 },
  { name: 'Belgium',     pps: 45700 },
  { name: 'Finland',     pps: 42700 },
  { name: 'France',      pps: 38500 },
  { name: 'Italy',       pps: 37000 },
  { name: 'Czechia',     pps: 34700 },
  { name: 'Spain',       pps: 33500 },
  { name: 'Portugal',    pps: 30500 },
  { name: 'Poland',      pps: 29300 },
  { name: 'Hungary',     pps: 27400 },
  { name: 'Greece',      pps: 25500 },
  { name: 'Bulgaria',    pps: 24400 },
].sort((a, b) => b.pps - a.pps);

function Tip({ active, payload, label, prefix = '', suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C_GREEN }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}
        </div>
      ))}
    </div>
  );
}

function ChartWrap({ title, meta, note, source, children }) {
  return (
    <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 12, padding: '24px 24px 20px', marginBottom: 28 }}>
      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#1A1916', marginBottom: 6 }}>{title}</h3>
      {meta && <p style={{ fontSize: 12, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", marginBottom: 20, lineHeight: 1.5 }}>{meta}</p>}
      {children}
      {note && <div style={{ marginTop: 12, padding: '10px 14px', background: '#F9F8F4', border: '1px solid #EDEAE4', borderRadius: 6, fontSize: 12, color: '#6B6860', lineHeight: 1.55, fontStyle: 'italic', fontFamily: "'DM Sans', sans-serif" }}>{note}</div>}
      {source && <div style={{ borderTop: '1px solid #F0EDE8', marginTop: 14, paddingTop: 10 }}><p style={{ fontSize: 11, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif" }}>Source: {source}</p></div>}
    </div>
  );
}

export default function IrelandEuropePage() {
  // GNI* per capita — approximate at ~163% of EU27 average (38,100 × 1.63 ≈ 62,100)
  const gniStarPPS = 62000;
  const gniStarIndexVsEU = Math.round(gniStarPPS / EU_AVG_PPS * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Hero */}
      <section style={{ paddingTop: 64, paddingBottom: 56 }}>
        <div style={{
          display: 'inline-block', marginBottom: 16, padding: '3px 12px',
          background: '#EEF6F2', border: '1px solid #B8DCCC', borderRadius: 999,
          fontSize: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0D4A36',
        }}>
          Ireland vs EU · Purchasing Power Standards · 2023
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400,
          lineHeight: 1.15, color: '#1A1916', marginBottom: 18,
          maxWidth: 760, letterSpacing: '-0.015em',
        }}>
          Ireland appears second-richest in the EU.<br />
          Dublin appears the richest NUTS3 region in Europe.<br />
          Both figures need significant qualification.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.72, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
          Eurostat's standard cross-country comparison uses GDP per capita in Purchasing
          Power Standards (PPS) — an artificial unit designed to remove price-level
          differences between countries. On this measure, Ireland ranks second in the EU
          at 213% of the EU27 average. Dublin NUTS3 registers 366% — the highest of any
          EU NUTS3 region.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.72, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
          These figures are not wrong — they are what Eurostat publishes. But they reflect
          the concentration of multinational profit-booking in Ireland rather than the
          purchasing power of Irish residents. GNI* per capita — approximately €{gniStarPPS.toLocaleString()} —
          places Ireland at around {gniStarIndexVsEU}% of the EU average: well above average,
          but not the outlier that GDP suggests.
        </p>
      </section>

      {/* PPS explanation */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916' }}>
            What PPS means — and why it still flatters Ireland
          </h2>
        </div>
        <div style={{ background: '#EEF6F2', border: '1px solid #B8DCCC', borderRadius: 10, padding: '20px 24px', marginBottom: 28, fontFamily: "'DM Sans', sans-serif" }}>
          <p style={{ fontSize: 14, color: '#0D4A36', lineHeight: 1.7, marginBottom: 10 }}>
            <strong>Purchasing Power Standards (PPS)</strong> adjust for price level
            differences between countries. €1 in Bulgaria buys more than €1 in Denmark,
            so PPS converts everything to a common purchasing-power equivalent. The EU27
            average was 38,100 PPS in 2023.
          </p>
          <p style={{ fontSize: 14, color: '#0D4A36', lineHeight: 1.7 }}>
            PPS removes price distortions but does <em>not</em> remove the MNC profit-booking
            distortion in Irish accounts. Ireland's nominal GDP is inflated by multinational
            activity that also passes through the price deflator — so even in PPS terms,
            the Irish figure substantially overstates the purchasing power of Irish residents.
          </p>
        </div>

        {/* Key metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Ireland GDP/cap (PPS) 2023', value: '81,200 PPS', sub: '213% of EU27 average · Eurostat nama_10_pc', note: '2nd in EU behind Luxembourg' },
            { label: 'EU27 average PPS 2023', value: '38,100 PPS', sub: '= 100 index — Eurostat', note: 'Reference benchmark' },
            { label: 'Dublin NUTS3 PPS 2023', value: '139,500 PPS', sub: '366% of EU27 · Eurostat NUTS3 (published)', note: 'Highest of any EU NUTS3 region' },
            { label: 'S-West NUTS3 PPS 2023', value: '137,300 PPS', sub: '360% of EU27 · Eurostat NUTS3 (published)', note: 'Second-highest EU NUTS3 region' },
            { label: 'GNI* per capita (approx)', value: `~${gniStarIndexVsEU}% EU avg`, sub: '≈€62,000 — not comparable in PPS terms', note: 'Preferred domestic income measure' },
            { label: 'Border NUTS3 PPS (derived)', value: '~25,400 PPS', sub: '~67% of EU27 · estimated from CSO GVA', note: 'Below EU average — derived, not published' },
          ].map(({ label, value, sub, note }) => (
            <div key={label} style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#A8A69F', fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C_GREEN, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4, marginBottom: 6 }}>{sub}</div>
              <div style={{ fontSize: 10, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic' }}>{note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Scatter plot */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916', marginBottom: 14 }}>
            Irish regions and EU countries: output vs unemployment
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
            This chart plots each EU member state and each Irish NUTS3 region by GDP per
            capita in PPS (horizontal axis) against unemployment rate (vertical axis).
            Dublin and South-West sit far to the right of every EU country — the MNC
            distortion in full view. The other Irish regions are broadly comparable to
            central and eastern European economies.
          </p>
        </div>

        <ChartWrap
          title="GDP per capita (PPS) vs Unemployment rate — Irish NUTS3 regions and EU countries"
          meta="X-axis: GDP per capita in PPS, 2023. Y-axis: unemployment rate %, annual average 2024. Dublin (139,500 PPS) and South-West (137,300 PPS) are Eurostat-published NUTS3 figures. Other Irish NUTS3 regions are derived estimates from CSO GVA × PPS conversion ratio."
          source="Eurostat NUTS3 GDP per inhabitant in PPS 2023 (nama_10r_3gdp) · Eurostat National Accounts GDP per capita 2023 (nama_10_pc) · Eurostat Unemployment [une_rt_a] 2024"
          note="PPS values for Irish NUTS3 regions other than Dublin and South-West are derived estimates, not Eurostat-published figures. They should be interpreted as indicative. The EU27 average for 2023 is 38,100 PPS."
        >
          <ScatterPlot regions={regionsData} />
        </ChartWrap>
      </section>

      {/* EU bar chart */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916', marginBottom: 14 }}>
            EU country comparison
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
            Ireland's nominal GDP per capita in PPS (81,200) is more than double the EU
            average (38,100). Even adjusted to the GNI* denominator — which is not standard
            Eurostat practice — Ireland would rank comfortably in the top five. What differs
            is the composition: Ireland's advantage is corporate rather than broad-based.
          </p>
        </div>

        <ChartWrap
          title="GDP per capita in PPS by EU country, 2023"
          meta={`EU27 average: 38,100 PPS (dashed reference line). Ireland (81,200 PPS) is highlighted. Only Luxembourg (91,100 PPS) ranks higher. Data: 18 EU member states shown for clarity.`}
          source="Eurostat National Accounts GDP per capita (nama_10_pc) 2023 — PPS index (EU27=100) × 38,100 EU average"
          note="PPS = Purchasing Power Standards. Derived as: (Eurostat country index / 100) × 38,100 EU average PPS. Rounded to nearest 100. Source index: Eurostat Statistics Explained 'National accounts and GDP' 2023 edition."
        >
          <ResponsiveContainer width="100%" height={520}>
            <BarChart data={EU_BAR_DATA} layout="vertical" margin={{ top: 5, right: 90, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} width={100} />
              <Tooltip content={<Tip suffix=" PPS" />} />
              <ReferenceLine x={EU_AVG_PPS} stroke={C_STONE} strokeDasharray="5 4"
                label={{ value: 'EU avg 38,100', position: 'top', fontSize: 10, fill: C_AXIS }} />
              <Bar dataKey="pps" name="GDP/cap (PPS)" radius={[0, 6, 6, 0]}
                label={{ position: 'right', formatter: v => `${(v/1000).toFixed(0)}k`, fontSize: 10, fill: C_AXIS }}>
                {EU_BAR_DATA.map((d, i) => (
                  <Cell key={i} fill={d.isIreland ? '#0A5440' : d.pps >= EU_AVG_PPS ? C_GREEN : C_GREEN_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrap>
      </section>

      {/* Navigation */}
      <section style={{ paddingBottom: 64 }}>
        <div style={{ borderTop: '1px solid #E2DFD8', paddingTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/ireland-on-paper" style={{ padding: '10px 18px', background: C_GREEN, color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            Ireland on Paper →
          </Link>
          <Link href="/regions" style={{ padding: '10px 18px', background: 'white', color: C_GREEN, border: '1px solid #B8DCCC', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            Regions of Ireland →
          </Link>
          <Link href="/methods-sources" style={{ padding: '10px 18px', background: 'white', color: '#4A4740', border: '1px solid #E2DFD8', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            Methods & Sources →
          </Link>
        </div>
      </section>
    </div>
  );
}
