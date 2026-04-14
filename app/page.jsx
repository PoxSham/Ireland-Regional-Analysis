'use client';

import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine, Cell,
} from 'recharts';
import regionsData from './data/regions.json';
import nationalData from './data/national.json';

export const dynamic = 'force-static';

/* ── Colour constants ─────────────────────────────────────── */
const C_GREEN      = '#0D6B4F';
const C_GREEN_LIGHT = '#7FA896';
const C_STONE      = '#B5A899';
const C_MUTED      = '#C5CCC9';
const C_AXIS       = '#6B6860';
const C_GRID       = '#F0EDE8';

/* ── Shared tooltip ───────────────────────────────────────── */
function Tip({ active, payload, label, prefix = '€', suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'white', border: '1px solid #E2DFD8',
      borderRadius: 8, padding: '10px 14px',
      fontSize: 12, color: '#1A1916',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C_GREEN }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}
        </div>
      ))}
    </div>
  );
}

/* ── Stat card ────────────────────────────────────────────── */
function StatCard({ label, value, sub, href }) {
  const inner = (
    <div style={{
      background: 'white', border: '1px solid #E2DFD8',
      borderRadius: 12, padding: '20px 22px',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: '#A8A69F',
        fontFamily: "'DM Sans', sans-serif",
      }}>{label}</div>
      <div style={{
        fontSize: 30, fontWeight: 700, color: C_GREEN,
        fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1,
      }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.45 }}>{sub}</div>}
    </div>
  );
  if (href) return <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link>;
  return inner;
}

/* ── Section link card ────────────────────────────────────── */
function SectionCard({ href, label, desc, tag }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white', border: '1px solid #E2DFD8',
        borderRadius: 12, padding: '20px 22px',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#B8DCCC'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2DFD8'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {tag && <div style={{
          display: 'inline-block', marginBottom: 8,
          padding: '2px 8px', background: '#EEF6F2', border: '1px solid #B8DCCC',
          borderRadius: 999, fontSize: 9, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: '#0D4A36', fontFamily: "'DM Sans', sans-serif",
        }}>{tag}</div>}
        <div style={{ fontSize: 14, fontWeight: 600, color: C_GREEN, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
        <div style={{ fontSize: 12, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{desc}</div>
      </div>
    </Link>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function HomePage() {
  const border = regionsData.find(r => r.id === 'northwest');
  const dublin = regionsData.find(r => r.id === 'dublin');
  const disparity = (dublin.gvaNominal2024 / border.gvaNominal2024).toFixed(1);

  // Regional GVA bar data
  const gvaBarData = [...regionsData]
    .map(r => ({ name: r.shortName, gva: r.gvaNominal2024, aboveAvg: r.gvaNominal2024 >= nationalData.gvaPerCapita2024 }))
    .sort((a, b) => b.gva - a.gva);

  // GDP vs GNI* divergence 2015–2024
  const gdpGniData = Object.entries(nationalData.gdpHistory).map(([yr, gdp]) => ({
    year: yr,
    GDP: gdp,
    'GNI*': nationalData.gniHistory[yr],
  }));

  // Tax breakdown (top 5 + Other)
  const taxData = nationalData.taxBreakdown2024.slice(0, 6);

  // Dublin vs Border trend
  const dublinTrend = Object.entries(dublin.gvaTimeSeries).map(([y, v]) => ({
    year: +y,
    Dublin: v,
    Border: border.gvaTimeSeries[y],
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ paddingTop: 72, paddingBottom: 64 }}>
        <div style={{
          display: 'inline-block', marginBottom: 16,
          padding: '3px 12px',
          background: '#EEF6F2', border: '1px solid #B8DCCC',
          borderRadius: 999,
          fontSize: 10, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: '#0D4A36',
        }}>
          Ireland · 2024 · Public Finance & Regional Economics
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 400, lineHeight: 1.12,
          color: '#1A1916', marginBottom: 20,
          maxWidth: 760, letterSpacing: '-0.02em',
        }}>
          Ireland looks wealthy on paper.<br />
          The real picture is more complicated.
        </h1>

        <p style={{
          fontSize: 18, lineHeight: 1.7,
          color: '#4A4740', maxWidth: 680,
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 32,
        }}>
          Ireland's GDP places it among the richest countries in Europe. But that figure is
          largely a statistical artefact — driven by multinational profit-booking rather than
          the incomes of people living here. This site makes the real numbers understandable:
          where tax money comes from, where it goes, and how the national story masks deep
          regional inequality.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/ireland-on-paper" style={{
            padding: '12px 22px',
            background: C_GREEN, color: 'white',
            borderRadius: 8, textDecoration: 'none',
            fontSize: 14, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Why Ireland looks rich on paper →
          </Link>
          <Link href="/taxes-and-spending" style={{
            padding: '12px 22px',
            background: 'white', color: C_GREEN,
            border: '1px solid #B8DCCC',
            borderRadius: 8, textDecoration: 'none',
            fontSize: 14, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Where your taxes go
          </Link>
        </div>
      </section>

      {/* ── KPI ROW ───────────────────────────────────────────── */}
      <section style={{ paddingBottom: 56 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
        }}>
          <StatCard
            label="GDP per capita 2024"
            value="€108,700"
            sub="Nominal — 2nd highest in EU. Distorted by MNC activity."
            href="/ireland-on-paper"
          />
          <StatCard
            label="GNI* per capita 2024"
            value="€62,000"
            sub="Modified income measure — strips out MNC distortions. CSO ANA 2024."
            href="/ireland-on-paper"
          />
          <StatCard
            label="Total tax revenue"
            value="€126bn"
            sub="2024 outturn. Corporation tax = 22% of all revenue."
            href="/taxes-and-spending"
          />
          <StatCard
            label="Regional output gap"
            value={`${disparity}×`}
            sub={`Dublin GVA per person vs Border. Dublin: €${(dublin.gvaNominal2024/1000).toFixed(0)}k · Border: €${(border.gvaNominal2024/1000).toFixed(0)}k`}
            href="/regions"
          />
        </div>
      </section>

      {/* ── SECTION 1: WHY IRELAND LOOKS RICH ON PAPER ───────── */}
      <section style={{ paddingBottom: 72 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 32, marginBottom: 32 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#A8A69F',
            fontFamily: "'DM Sans', sans-serif", marginBottom: 10,
          }}>Ireland on Paper</div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, color: '#1A1916', marginBottom: 14,
          }}>
            A GDP figure that flatters to deceive
          </h2>
          <p style={{
            fontSize: 16, lineHeight: 1.7, color: '#4A4740',
            maxWidth: 680, fontFamily: "'DM Sans', sans-serif",
            marginBottom: 24,
          }}>
            Ireland's GDP is the second-highest in the EU. But when you strip out the profits
            that multinational companies book here — intellectual property licences, aircraft
            leasing, pharmaceutical royalties — the domestic income picture is very different.
            GNI* (Modified Gross National Income), developed by the CSO specifically to remove
            these distortions, stood at €321.1bn in 2024: just 57% of GDP.
          </p>
          <p style={{
            fontSize: 16, lineHeight: 1.7, color: '#4A4740',
            maxWidth: 680, fontFamily: "'DM Sans', sans-serif",
            marginBottom: 32,
          }}>
            This gap is not an accounting quirk. It affects how Ireland is perceived
            internationally, how EU funding is allocated, and how domestic policy debates are
            framed. A country can be simultaneously a top-ranked GDP economy and have
            households that struggle with rent, childcare, and public services.
          </p>
        </div>

        {/* GDP vs GNI* chart */}
        <div style={{
          background: 'white', border: '1px solid #E2DFD8',
          borderRadius: 12, padding: '24px 24px 20px',
        }}>
          <h3 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 18, color: '#1A1916', marginBottom: 6,
          }}>
            GDP vs GNI* — the divergence since 2015
          </h3>
          <p style={{ fontSize: 12, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
            GDP grew from €263bn (2015) to €563bn (2024) — largely on the back of MNC activity.
            GNI* grew more modestly, from €174bn to €321bn. The gap between the two lines is
            the scale of multinational distortion.
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={gdpGniData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: C_AXIS }} />
              <YAxis tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${v}bn`} />
              <Tooltip content={<Tip prefix="€" suffix="bn" />} />
              <Line type="monotone" dataKey="GDP" stroke={C_STONE} strokeWidth={2} dot={{ r: 2.5 }} strokeDasharray="4 3" />
              <Line type="monotone" dataKey="GNI*" stroke={C_GREEN} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{
            display: 'flex', gap: 20, marginTop: 12,
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 24, height: 2.5, background: C_GREEN, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif" }}>GNI* — domestic income measure</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="24" height="3"><line x1="0" y1="1.5" x2="24" y2="1.5" stroke={C_STONE} strokeWidth="2" strokeDasharray="4 3"/></svg>
              <span style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif" }}>GDP — inflated by MNC activity</span>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #F0EDE8', marginTop: 14, paddingTop: 10 }}>
            <p style={{ fontSize: 11, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif" }}>
              Source: CSO Annual National Accounts 2024 — GDP and GNI* (Modified Gross National Income), €bn, national totals
            </p>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Link href="/ireland-on-paper" style={{
            fontSize: 14, color: C_GREEN, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, textDecoration: 'none',
          }}>
            Full analysis: Ireland on Paper →
          </Link>
        </div>
      </section>

      {/* ── SECTION 2: WHERE YOUR TAXES GO ───────────────────── */}
      <section style={{ paddingBottom: 72 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 32, marginBottom: 32 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#A8A69F',
            fontFamily: "'DM Sans', sans-serif", marginBottom: 10,
          }}>Taxes & Spending</div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, color: '#1A1916', marginBottom: 14,
          }}>
            €126 billion collected. Here is where it comes from.
          </h2>
          <p style={{
            fontSize: 16, lineHeight: 1.7, color: '#4A4740',
            maxWidth: 680, fontFamily: "'DM Sans', sans-serif",
            marginBottom: 0,
          }}>
            In 2024, Ireland collected more tax revenue than at any point in its history.
            But the composition is striking: corporation tax — overwhelmingly paid by a small
            number of US multinationals — has become the second-largest revenue source,
            accounting for 22% of all taxes. Three companies alone pay 46% of all corporation
            tax receipts, creating a structural dependency that the Irish Fiscal Advisory
            Council has repeatedly flagged as a risk.
          </p>
        </div>

        {/* Tax chart */}
        <div style={{
          background: 'white', border: '1px solid #E2DFD8',
          borderRadius: 12, padding: '24px 24px 20px',
        }}>
          <h3 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 18, color: '#1A1916', marginBottom: 6,
          }}>
            Tax revenue by category, 2024
          </h3>
          <p style={{ fontSize: 12, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
            Total: €{nationalData.totalTaxRevenue2024Bn}bn. Corporation tax (€{nationalData.ctRevenue2024Bn}bn)
            has overtaken VAT (€21.9bn) as the second-largest revenue source.
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={taxData} layout="vertical" margin={{ top: 0, right: 80, left: 10, bottom: 0 }}>
              <CartesianGrid stroke={C_GRID} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${v}bn`} />
              <YAxis type="category" dataKey="tax" tick={{ fontSize: 11, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} width={155} />
              <Tooltip content={<Tip prefix="€" suffix="bn" />} />
              <Bar dataKey="amountBn" radius={[0, 6, 6, 0]}
                label={{ position: 'right', formatter: v => `€${v}bn`, fontSize: 10, fill: C_AXIS }}>
                {taxData.map((d, i) => (
                  <Cell key={i} fill={d.tax === 'Corporation Tax' ? '#1A4A36' : i < 3 ? C_GREEN : C_GREEN_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ borderTop: '1px solid #F0EDE8', marginTop: 14, paddingTop: 10 }}>
            <p style={{ fontSize: 11, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif" }}>
              Source: CSO Tax Revenue Statistics 2024 / Revenue Commissioners
            </p>
          </div>
        </div>

        {/* CT risk callout */}
        <div style={{
          marginTop: 16,
          background: '#FEF9EC', border: '1px solid #F5D06A',
          borderRadius: 10, padding: '16px 20px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, color: '#7A5C00', lineHeight: 1.65,
        }}>
          <strong>Corporation tax concentration risk:</strong> Three multinationals pay 46% of
          all CT receipts. 88% of CT revenue comes from foreign-owned companies. OECD Pillar
          Two — the global 15% minimum tax — may reduce Ireland's competitiveness advantage and
          compress future CT windfalls significantly.
        </div>

        <div style={{ marginTop: 20 }}>
          <Link href="/taxes-and-spending" style={{
            fontSize: 14, color: C_GREEN, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, textDecoration: 'none',
          }}>
            Full breakdown: Taxes & Spending →
          </Link>
        </div>
      </section>

      {/* ── SECTION 3: DUBLIN VS THE REST ────────────────────── */}
      <section style={{ paddingBottom: 72 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 32, marginBottom: 32 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#A8A69F',
            fontFamily: "'DM Sans', sans-serif", marginBottom: 10,
          }}>Regions of Ireland</div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, color: '#1A1916', marginBottom: 14,
          }}>
            Dublin generates {Math.round(dublin.gvaNominal2024 / border.gvaNominal2024 * 10) / 10}× the output per person of the Border region
          </h2>
          <p style={{
            fontSize: 16, lineHeight: 1.7, color: '#4A4740',
            maxWidth: 680, fontFamily: "'DM Sans', sans-serif",
            marginBottom: 0,
          }}>
            Ireland's national output figures are dominated by Dublin and the South-West —
            both supercharged by multinational concentration. The regions that house most of
            the country's land area and a significant share of its people tell a very different
            story. The Border region's output per person (€{border.gvaNominal2024.toLocaleString()}) is less
            than a fifth of Dublin's (€{dublin.gvaNominal2024.toLocaleString()}) — a gap that has
            widened steadily since 2015.
          </p>
        </div>

        {/* Regional GVA bar chart */}
        <div style={{
          background: 'white', border: '1px solid #E2DFD8',
          borderRadius: 12, padding: '24px 24px 20px',
          marginBottom: 16,
        }}>
          <h3 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 18, color: '#1A1916', marginBottom: 6,
          }}>
            GVA per person by NUTS3 region, 2024
          </h3>
          <p style={{ fontSize: 12, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
            National average: €{nationalData.gvaPerCapita2024.toLocaleString()} — shown as dashed line.
            Only Dublin and South-West exceed it.
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={gvaBarData} layout="vertical" margin={{ top: 5, right: 90, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} width={90} />
              <Tooltip content={<Tip />} />
              <ReferenceLine x={nationalData.gvaPerCapita2024} stroke={C_GREEN_LIGHT} strokeDasharray="5 4"
                label={{ value: 'Avg €99.5k', position: 'top', fontSize: 10, fill: C_AXIS }} />
              <Bar dataKey="gva" radius={[0, 6, 6, 0]}
                label={{ position: 'right', formatter: v => `€${(v/1000).toFixed(0)}k`, fontSize: 10, fill: C_AXIS }}>
                {gvaBarData.map((d, i) => (
                  <Cell key={i} fill={d.aboveAvg ? C_GREEN : C_GREEN_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ borderTop: '1px solid #F0EDE8', marginTop: 14, paddingTop: 10 }}>
            <p style={{ fontSize: 11, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif" }}>
              Source: CSO County Incomes and Regional GDP 2024, Table 4.1 — NUTS3 regions (7), nominal GVA per person
            </p>
          </div>
        </div>

        {/* Dublin vs Border divergence */}
        <div style={{
          background: 'white', border: '1px solid #E2DFD8',
          borderRadius: 12, padding: '24px 24px 20px',
        }}>
          <h3 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 18, color: '#1A1916', marginBottom: 6,
          }}>
            Widening gap: Dublin vs Border, 2015–2024
          </h3>
          <p style={{ fontSize: 12, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
            The divergence has accelerated since 2015 as Dublin absorbed the bulk of
            multinational investment and high-wage employment growth.
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dublinTrend} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: C_AXIS }} />
              <YAxis tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<Tip />} />
              <Line type="monotone" dataKey="Dublin" stroke={C_GREEN} strokeWidth={2.5} dot={{ r: 3 }} name="Dublin" />
              <Line type="monotone" dataKey="Border" stroke={C_MUTED} strokeWidth={2.5} dot={{ r: 3 }} name="Border" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 2.5, background: C_GREEN, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif" }}>Dublin</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 2.5, background: C_MUTED, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif" }}>Border region</span>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #F0EDE8', marginTop: 14, paddingTop: 10 }}>
            <p style={{ fontSize: 11, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif" }}>
              Source: CSO County Incomes and Regional GDP, various years — nominal GVA per person
            </p>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Link href="/regions" style={{
            fontSize: 14, color: C_GREEN, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, textDecoration: 'none',
          }}>
            Explore all regions →
          </Link>
        </div>
      </section>

      {/* ── SECTION 4: IRELAND VS EU ──────────────────────────── */}
      <section style={{ paddingBottom: 72 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 32, marginBottom: 32 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#A8A69F',
            fontFamily: "'DM Sans', sans-serif", marginBottom: 10,
          }}>Ireland vs EU</div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, color: '#1A1916', marginBottom: 14,
          }}>
            Ireland ranks near the top of every European league table — with caveats
          </h2>
          <p style={{
            fontSize: 16, lineHeight: 1.7, color: '#4A4740',
            maxWidth: 680, fontFamily: "'DM Sans', sans-serif",
          }}>
            Eurostat data shows Dublin at 366% of the EU average in GDP per capita (PPS) —
            the highest of any EU NUTS3 region, ahead of Luxembourg. But this figure is almost
            entirely a product of how multinationals book profits rather than the economic
            output of people living in Dublin. When Ireland is benchmarked against EU peers
            using GNI* or disposable household income, its position is comfortable but not
            exceptional.
          </p>
        </div>

        {/* Quick EU highlight boxes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14, marginBottom: 28,
        }}>
          {[
            { label: 'Dublin GDP per capita (PPS)', value: '139,500', sub: '366% of EU27 average · Eurostat 2023', note: 'Published NUTS3 figure' },
            { label: 'Ireland national PPS rank', value: '#2 in EU', sub: '€81,200 PPS per capita · 2023', note: 'Behind Luxembourg only' },
            { label: 'GNI* per capita', value: '€62,000', sub: '~163% of EU average · CSO 2024', note: 'Strips out MNC distortion' },
            { label: 'Border region PPS', value: '~25,400', sub: 'Derived estimate · below EU avg', note: 'Not Eurostat-published figure' },
          ].map(({ label, value, sub, note }) => (
            <div key={label} style={{
              background: 'white', border: '1px solid #E2DFD8',
              borderRadius: 12, padding: '18px 20px',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#A8A69F', fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: C_GREEN, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4, marginBottom: 6 }}>{sub}</div>
              <div style={{ fontSize: 10, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic' }}>{note}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 4 }}>
          <Link href="/ireland-europe" style={{
            fontSize: 14, color: C_GREEN, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, textDecoration: 'none',
          }}>
            Ireland vs EU: full comparison →
          </Link>
        </div>
      </section>

      {/* ── SECTION 5: EXPLORE THE SITE ──────────────────────── */}
      <section style={{ paddingBottom: 64 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 32, marginBottom: 24 }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 24, color: '#1A1916',
          }}>
            Explore
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
        }}>
          <SectionCard href="/ireland-on-paper" tag="Analysis" label="Ireland on Paper"
            desc="GDP vs GNI* — why the headline figure is misleading, and what a more honest measure shows." />
          <SectionCard href="/taxes-and-spending" tag="Public Finance" label="Taxes & Spending"
            desc="Where €126bn in tax revenue comes from, and how the government spends it." />
          <SectionCard href="/ireland-europe" tag="Comparison" label="Ireland vs EU"
            desc="Irish regions and EU countries compared in Purchasing Power Standards (PPS)." />
          <SectionCard href="/regions" tag="Regional" label="Regions of Ireland"
            desc="GVA, disposable income, rent, unemployment, and infrastructure across all 7 NUTS3 regions." />
          <SectionCard href="/households" tag="Living Standards" label="Households & Rent"
            desc="What households actually take home — and how housing costs erode Dublin's income advantage." />
          <SectionCard href="/methods-sources" tag="Reference" label="Methods & Sources"
            desc="Every figure has a source, year, geography, and definition. Caveats are clearly stated." />
        </div>
      </section>

      {/* ── TRUST / METHODS BLOCK ─────────────────────────────── */}
      <section style={{ paddingBottom: 64 }}>
        <div style={{
          background: 'white', border: '1px solid #E2DFD8',
          borderRadius: 14, padding: '32px 36px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 32,
        }}>
          <div>
            <h3 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20, color: '#1A1916', marginBottom: 12,
            }}>
              How this site works
            </h3>
            <p style={{ fontSize: 14, color: '#4A4740', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
              Every figure on this site comes from an official published source: CSO, Eurostat,
              IFAC, RTB, Wind Energy Ireland, or EirGrid. Where estimates are used — for
              counties or NUTS3 breakdowns not published directly — they are clearly labelled
              as such and the methodology is explained.
            </p>
            <Link href="/methods-sources" style={{
              display: 'inline-block', marginTop: 16,
              fontSize: 13, color: C_GREEN, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", textDecoration: 'none',
            }}>
              Read the methods note →
            </Link>
          </div>
          <div>
            <h3 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20, color: '#1A1916', marginBottom: 12,
            }}>
              Primary sources
            </h3>
            <ul style={{
              listStyle: 'none', display: 'flex',
              flexDirection: 'column', gap: 8,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {[
                { name: 'CSO County Incomes and Regional GDP 2024', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-cirgdp/countyincomesandregionalgdp2024/' },
                { name: 'CSO Annual National Accounts 2024', url: 'https://www.cso.ie/en/releasesandpublications/ep/p-ana/annualnationalaccounts2024/' },
                { name: 'Eurostat National Accounts GDP per capita', url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=National_accounts_and_GDP' },
                { name: 'IFAC Fiscal Assessment Report 2026', url: 'https://www.fiscalcouncil.ie/fiscal-assessment-reports/' },
                { name: 'RTB Rent Index Q2 2024', url: 'https://www.rtb.ie/research/rtb-rent-index/' },
              ].map(({ name, url }) => (
                <li key={name}>
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: 12, color: '#4A4740',
                    textDecoration: 'underline', textDecorationColor: '#C5BFB8',
                    textUnderlineOffset: '2px',
                  }}>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}
