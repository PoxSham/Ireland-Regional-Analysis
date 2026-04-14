'use client';

import Link from 'next/link';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';
import nationalData from '../data/national.json';

export const dynamic = 'force-static';

const C_GREEN       = '#0D6B4F';
const C_GREEN_LIGHT = '#7FA896';
const C_STONE       = '#B5A899';
const C_AXIS        = '#6B6860';
const C_GRID        = '#F0EDE8';

function Tip({ active, payload, label, prefix = '€', suffix = '' }) {
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
      {note && (
        <div style={{ marginTop: 12, padding: '10px 14px', background: '#F9F8F4', border: '1px solid #EDEAE4', borderRadius: 6, fontSize: 12, color: '#6B6860', lineHeight: 1.55, fontStyle: 'italic', fontFamily: "'DM Sans', sans-serif" }}>
          {note}
        </div>
      )}
      {source && (
        <div style={{ borderTop: '1px solid #F0EDE8', marginTop: 14, paddingTop: 10 }}>
          <p style={{ fontSize: 11, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif" }}>Source: {source}</p>
        </div>
      )}
    </div>
  );
}

export default function IrelandOnPaperPage() {
  const gdpGniData = Object.entries(nationalData.gdpHistory).map(([yr, gdp]) => ({
    year: yr,
    'GDP': gdp,
    'GNI*': nationalData.gniHistory[yr],
  }));

  const gniRatioData = Object.entries(nationalData.gdpHistory).map(([yr, gdp]) => ({
    year: yr,
    'GNI* as % of GDP': parseFloat(((nationalData.gniHistory[yr] / gdp) * 100).toFixed(1)),
  }));

  const debtData = Object.entries(nationalData.debtHistory.grossBn).map(([yr, gross]) => ({
    year: yr,
    'Debt / GDP %': nationalData.debtHistory.gdpPct[yr],
    'Debt / GNI* %': nationalData.debtHistory.gniPct[yr],
  }));

  const GDP2024_ESTIMATE_BN = 563;
  const GDP_PER_CAPITA = Math.round(GDP2024_ESTIMATE_BN * 1e9 / nationalData.population2024);

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
          Ireland on Paper · National Accounts · 2024
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400,
          lineHeight: 1.15, color: '#1A1916', marginBottom: 18,
          maxWidth: 760, letterSpacing: '-0.015em',
        }}>
          Ireland is the second-richest country in the EU.<br />
          The asterisk matters enormously.
        </h1>

        <p style={{ fontSize: 17, lineHeight: 1.72, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
          Ireland's GDP per capita of approximately €{Math.round(GDP_PER_CAPITA/1000)}k places it behind only
          Luxembourg in the EU. But this figure is almost entirely a product of how
          multinational corporations use Ireland as a booking location for profits, intellectual
          property, and aircraft leasing — not a measure of what people living in Ireland
          actually earn or own.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.72, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
          The Central Statistics Office developed GNI* (Modified Gross National Income)
          specifically to remove these distortions. In 2024, GNI* stood at €321.1bn —
          57% of GDP. The gap between these two figures, now over €240bn, is the scale of
          the statistical illusion.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.72, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
          This page explains how the distortion works, how large it has grown, and why
          it matters for how Ireland is perceived internationally and how public debate
          here is framed.
        </p>
      </section>

      {/* What GNI* removes */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916', marginBottom: 0 }}>
            What GNI* removes from the picture
          </h2>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 14, marginBottom: 32,
        }}>
          {[
            {
              title: 'IP profit transfers',
              body: 'Multinational companies relocate intellectual property — patents, software, drug formulas — to Irish subsidiaries. The royalties and licensing income then flows through Ireland\'s national accounts, inflating GDP without representing local economic activity.',
            },
            {
              title: 'Aircraft leasing',
              body: 'Ireland hosts around half of the world\'s leased aircraft fleet by value. The depreciation and profits from these assets, owned by Irish-registered entities, flow through GDP but involve no meaningful domestic economic activity.',
            },
            {
              title: 'Retained MNC profits',
              body: 'Profits earned by re-domiciled multinationals — companies incorporated in Ireland but operating primarily elsewhere — are included in Ireland\'s Gross National Income but not in GNI*. These represent income to foreign shareholders, not Irish residents.',
            },
          ].map(({ title, body }) => (
            <div key={title} style={{
              background: 'white', border: '1px solid #E2DFD8',
              borderRadius: 12, padding: '20px 22px',
            }}>
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, color: '#1A1916', marginBottom: 10 }}>{title}</h4>
              <p style={{ fontSize: 13, color: '#4A4740', lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{body}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: '#EEF6F2', border: '1px solid #B8DCCC',
          borderRadius: 10, padding: '16px 20px',
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#0D4A36', lineHeight: 1.65,
        }}>
          <strong>Key definitions:</strong> GDP (Gross Domestic Product) counts all economic
          activity within Ireland's borders. GNI (Gross National Income) adds income received
          from abroad and subtracts income sent abroad. GNI* additionally removes the specific
          MNC distortions listed above. In most countries, these three measures are close together.
          In Ireland, GDP is 175% of GNI* — the largest gap of any EU country.
        </div>
      </section>

      {/* Charts */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916' }}>The numbers</h2>
        </div>

        <ChartWrap
          title="GDP vs GNI* — total, €bn, 2015–2024"
          meta={`GDP grew from €263bn to €563bn over nine years — more than doubling. GNI* grew more modestly, from €174bn to €321bn. The gap between the two lines represents the scale of MNC distortion in Irish national accounts.`}
          source="CSO Annual National Accounts 2024 — Table 1, GDP and GNI* current market prices"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={gdpGniData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: C_AXIS }} />
              <YAxis tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${v}bn`} />
              <Tooltip content={<Tip prefix="€" suffix="bn" />} />
              <Line type="monotone" dataKey="GDP" stroke={C_STONE} strokeWidth={2} dot={{ r: 2.5 }} strokeDasharray="4 3" name="GDP" />
              <Line type="monotone" dataKey="GNI*" stroke={C_GREEN} strokeWidth={2.5} dot={{ r: 3 }} name="GNI*" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 2.5, background: C_GREEN, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif" }}>GNI* — the preferred domestic measure</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="20" height="3"><line x1="0" y1="1.5" x2="20" y2="1.5" stroke={C_STONE} strokeWidth="2" strokeDasharray="4 3"/></svg>
              <span style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif" }}>GDP — includes MNC distortions</span>
            </div>
          </div>
        </ChartWrap>

        <ChartWrap
          title="GNI* as a share of GDP, 2015–2024 (%)"
          meta="As MNC activity concentrated in Ireland accelerated after 2015, GNI* fell as a share of GDP — reaching a low of roughly 55% in 2022. The partial recovery to 57% reflects shifting profit repatriation patterns rather than structural change."
          source="CSO Annual National Accounts 2024 — derived ratio"
          note="A ratio of 57% means that for every €100 of GDP counted by Eurostat, roughly €43 relates to MNC activity that does not represent income to Irish residents."
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={gniRatioData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: C_AXIS }} />
              <YAxis domain={[50, 75]} tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<Tip prefix="" suffix="%" />} />
              <ReferenceLine y={100} stroke={C_STONE} strokeDasharray="4 4"
                label={{ value: '100% (no distortion)', position: 'top', fontSize: 10, fill: C_AXIS }} />
              <Line type="monotone" dataKey="GNI* as % of GDP" stroke={C_GREEN} strokeWidth={2.5} dot={{ r: 3 }} name="GNI* ÷ GDP" />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrap>

        <ChartWrap
          title="National debt: how the benchmark changes everything"
          meta={`Ireland's gross national debt (€${nationalData.grossDebt2024Bn}bn, 2024) looks manageable at 38% of GDP. Against GNI* — the more honest denominator for an Irish context — it is 67%. Both are relatively low, but the GNI* figure is a better guide to the real debt burden on domestic economic activity.`}
          source="CSO Government Finance Statistics Oct 2025; CSO ANA 2024"
          note="IFAC recommends using GNI* as the denominator for Irish fiscal analysis. Eurostat uses GDP for cross-country comparison — which systematically flatters Ireland's debt ratios."
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={debtData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: C_AXIS }} />
              <YAxis tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<Tip prefix="" suffix="%" />} />
              <Bar dataKey="Debt / GDP %" fill={C_STONE} radius={[4,4,0,0]} name="Debt / GDP" />
              <Bar dataKey="Debt / GNI* %" fill={C_GREEN} radius={[4,4,0,0]} name="Debt / GNI*" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 12, background: C_GREEN, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif" }}>Debt / GNI* — preferred measure</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 12, background: C_STONE, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif" }}>Debt / GDP — understates the burden</span>
            </div>
          </div>
        </ChartWrap>
      </section>

      {/* KPIs */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916' }}>Key figures, 2024</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { label: 'GDP 2024', value: `€${nationalData.gdp2024Bn}bn`, sub: 'Nominal, current prices — includes MNC distortions' },
            { label: 'GNI* 2024', value: `€${nationalData.gni2024Bn}bn`, sub: `${nationalData.gniAsShareOfGdp}% of GDP — domestic income measure` },
            { label: 'GNI* per capita', value: `€${nationalData.gniStarPerCapita.toLocaleString()}`, sub: 'Per person — CSO ANA 2024' },
            { label: 'Modified domestic demand growth', value: `+${nationalData.mddGrowth2024}%`, sub: 'CSO preferred growth measure, 2024' },
            { label: 'Budget surplus 2024', value: `€${nationalData.surplus2024Bn}bn`, sub: '38.3% of GDP / 67.1% of GNI* (gross debt)' },
            { label: 'Population 2024', value: nationalData.population2024.toLocaleString(), sub: 'CSO Population Estimates 2024' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#A8A69F', fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: C_GREEN, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1, marginBottom: 6 }}>{value}</div>
              <div style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.45 }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation links */}
      <section style={{ paddingBottom: 64 }}>
        <div style={{ borderTop: '1px solid #E2DFD8', paddingTop: 28 }}>
          <p style={{ fontSize: 13, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>Continue reading</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/taxes-and-spending" style={{ padding: '10px 18px', background: C_GREEN, color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
              Taxes & Spending →
            </Link>
            <Link href="/ireland-europe" style={{ padding: '10px 18px', background: 'white', color: C_GREEN, border: '1px solid #B8DCCC', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
              Ireland vs EU →
            </Link>
            <Link href="/methods-sources#definitions" style={{ padding: '10px 18px', background: 'white', color: '#4A4740', border: '1px solid #E2DFD8', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
              Definitions & methods →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
