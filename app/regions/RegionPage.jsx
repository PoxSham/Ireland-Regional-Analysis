'use client';

import Link from 'next/link';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';
import nationalData from '../data/national.json';

const C_GREEN       = '#0D6B4F';
const C_GREEN_LIGHT = '#7FA896';
const C_STONE       = '#B5A899';
const C_MUTED       = '#C5CCC9';
const C_AXIS        = '#6B6860';
const C_GRID        = '#F0EDE8';

function Tip({ active, payload, label, prefix = '€', suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C_GREEN }}>{p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}</div>
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

// regionData = single region object from regions.json
// allRegions = full regions array (for comparison bar)
export default function RegionPage({ regionData, allRegions }) {
  const r = regionData;

  const trendData = Object.entries(r.gvaTimeSeries).map(([yr, v]) => ({
    year: +yr,
    [r.shortName]: v,
  }));

  const rankData = [...allRegions]
    .map(reg => ({ name: reg.shortName, gva: reg.gvaNominal2024, isThis: reg.id === r.id }))
    .sort((a, b) => b.gva - a.gva);

  const incomeRankData = [...allRegions]
    .map(reg => ({ name: reg.shortName, income: reg.disposableIncome2024, isThis: reg.id === r.id }))
    .sort((a, b) => b.income - a.income);

  const rentToIncome = r.rentToIncome;
  const afterRent = r.disposableIncome2024 - r.rent2024 * 12;

  const comparisons = [
    { label: 'National avg GVA', value: nationalData.gvaPerCapita2024, vs: r.gvaNominal2024 },
  ];
  const gvaVsNational = ((r.gvaNominal2024 / nationalData.gvaPerCapita2024) * 100).toFixed(0);
  const incomeVsTop = ((r.disposableIncome2024 / allRegions.find(x => x.id === 'dublin').disposableIncome2024) * 100).toFixed(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Hero */}
      <section style={{ paddingTop: 64, paddingBottom: 56 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <div style={{
            display: 'inline-block', padding: '3px 12px',
            background: '#EEF6F2', border: '1px solid #B8DCCC', borderRadius: 999,
            fontSize: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0D4A36',
          }}>
            {r.parent} · NUTS3 · 2024
          </div>
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400,
          lineHeight: 1.15, color: '#1A1916', marginBottom: 16,
          maxWidth: 760, letterSpacing: '-0.015em',
        }}>
          {r.displayName}
        </h1>

        <p style={{ fontSize: 17, lineHeight: 1.72, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
          {r.description}
        </p>
        <p style={{ fontSize: 14, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif" }}>
          Counties: {r.counties.join(', ')} · Population: {(r.population / 1000).toFixed(0)}k
        </p>
      </section>

      {/* KPI row */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {[
            { label: 'GVA per person', value: `€${r.gvaNominal2024.toLocaleString()}`, sub: `${gvaVsNational}% of national average (€${nationalData.gvaPerCapita2024.toLocaleString()})` },
            { label: 'Disposable income', value: `€${r.disposableIncome2024.toLocaleString()}`, sub: `${incomeVsTop}% of Dublin disposable income` },
            { label: 'Monthly rent', value: `€${r.rent2024.toLocaleString()}`, sub: `€${(r.rent2024 * 12).toLocaleString()} annually — RTB Q2 2024` },
            { label: 'Rent-to-income', value: `${rentToIncome}%`, sub: 'Annual rent as % of disposable income' },
            { label: 'After-rent income', value: `€${afterRent.toLocaleString()}`, sub: 'Annual income remaining after rent' },
            { label: 'Unemployment', value: `${r.unemployment2024}%`, sub: 'CSO LFS 2024 annual average' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#A8A69F', fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C_GREEN, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1, marginBottom: 6 }}>{value}</div>
              <div style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.45 }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GVA trend */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916' }}>
            Output over time
          </h2>
        </div>
        <ChartWrap
          title={`GVA per person — ${r.displayName}, 2015–2024`}
          meta={`From €${r.gvaTimeSeries['2015'].toLocaleString()} in 2015 to €${r.gvaNominal2024.toLocaleString()} in 2024 — ${r.id === 'dublin' || r.id === 'southwest' ? 'reflecting significant MNC activity growth' : 'reflecting modest organic economic growth'}. National average (€${nationalData.gvaPerCapita2024.toLocaleString()}) shown as reference.`}
          source="CSO County Incomes and Regional GDP, 2015–2024 — nominal GVA per person"
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: C_AXIS }} />
              <YAxis tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<Tip />} />
              <ReferenceLine y={nationalData.gvaPerCapita2024} stroke={C_STONE} strokeDasharray="5 4"
                label={{ value: 'National avg', position: 'right', fontSize: 10, fill: C_AXIS }} />
              <Line type="monotone" dataKey={r.shortName} stroke={C_GREEN} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrap>
      </section>

      {/* All-region comparison */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916' }}>
            How {r.shortName} compares
          </h2>
        </div>
        <ChartWrap
          title="GVA per person — all NUTS3 regions, 2024"
          meta={`${r.displayName} highlighted. National average: €${nationalData.gvaPerCapita2024.toLocaleString()}.`}
          source="CSO County Incomes and Regional GDP 2024 — Table 4.1"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rankData} layout="vertical" margin={{ top: 5, right: 90, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} width={90} />
              <Tooltip content={<Tip />} />
              <ReferenceLine x={nationalData.gvaPerCapita2024} stroke={C_STONE} strokeDasharray="5 4" />
              <Bar dataKey="gva" radius={[0, 6, 6, 0]}
                label={{ position: 'right', formatter: v => `€${(v/1000).toFixed(0)}k`, fontSize: 10, fill: C_AXIS }}>
                {rankData.map((d, i) => (
                  <Cell key={i} fill={d.isThis ? '#0A5440' : d.gva >= nationalData.gvaPerCapita2024 ? C_GREEN : C_GREEN_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrap>

        <ChartWrap
          title="Disposable income per person — all NUTS3 regions, 2024"
          meta={`${r.displayName} highlighted.`}
          source="CSO County Incomes and Regional GDP 2024 — Table 3.1"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={incomeRankData} layout="vertical" margin={{ top: 5, right: 90, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} width={90} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="income" radius={[0, 6, 6, 0]}
                label={{ position: 'right', formatter: v => `€${v.toLocaleString()}`, fontSize: 10, fill: C_AXIS }}>
                {incomeRankData.map((d, i) => (
                  <Cell key={i} fill={d.isThis ? '#0A5440' : C_GREEN_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrap>
      </section>

      {/* Nav */}
      <section style={{ paddingBottom: 64 }}>
        <div style={{ borderTop: '1px solid #E2DFD8', paddingTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/regions" style={{ padding: '10px 18px', background: C_GREEN, color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            ← All regions
          </Link>
          <Link href="/households" style={{ padding: '10px 18px', background: 'white', color: C_GREEN, border: '1px solid #B8DCCC', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            Households & rent →
          </Link>
          <Link href="/methods-sources" style={{ padding: '10px 18px', background: 'white', color: '#4A4740', border: '1px solid #E2DFD8', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            Data methods →
          </Link>
        </div>
      </section>
    </div>
  );
}
