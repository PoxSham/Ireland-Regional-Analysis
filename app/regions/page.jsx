'use client';

import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import regionsData from '../data/regions.json';
import nationalData from '../data/national.json';

export const dynamic = 'force-static';

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

export default function RegionsPage() {
  const sorted = [...regionsData].sort((a, b) => b.gvaNominal2024 - a.gvaNominal2024);
  const dublin = regionsData.find(r => r.id === 'dublin');
  const border = regionsData.find(r => r.id === 'northwest');

  const dispIncome = [...regionsData]
    .map(r => ({ name: r.shortName, income: r.disposableIncome2024 }))
    .sort((a, b) => b.income - a.income);

  const unemploy = [...regionsData]
    .map(r => ({ name: r.shortName, rate: r.unemployment2024, id: r.id }))
    .sort((a, b) => b.rate - a.rate);

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
          Regions of Ireland · NUTS3 · 2024
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400,
          lineHeight: 1.15, color: '#1A1916', marginBottom: 18,
          maxWidth: 760, letterSpacing: '-0.015em',
        }}>
          Ireland is not one economy.<br />
          It is seven — with very different stories.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.72, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
          Ireland has 7 NUTS3 regions under the EU's standard statistical geography. Their
          economic situations could not be more different. Dublin generates
          €{dublin.gvaNominal2024.toLocaleString()} of GVA per person — more than five times
          the output of the Border region (€{border.gvaNominal2024.toLocaleString()}).
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.72, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
          But output alone does not tell the full story. When you look at disposable income,
          housing costs, unemployment, and infrastructure quality, the picture becomes more
          nuanced — and in some ways, more concerning.
        </p>
      </section>

      {/* Regional summary table */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916' }}>
            All 7 NUTS3 regions — key metrics
          </h2>
        </div>
        <div style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 12, overflow: 'hidden', marginBottom: 28, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr style={{ background: '#F9F8F4' }}>
                <th>Region</th>
                <th>GVA / person</th>
                <th>Disp. income</th>
                <th>Monthly rent</th>
                <th>Unemployment</th>
                <th>Population</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#1A1916', fontFamily: "'DM Sans', sans-serif" }}>
                      {r.id === 'dublin' ? (
                        <Link href="/regions/dublin" style={{ color: C_GREEN, textDecoration: 'none' }}>{r.displayName}</Link>
                      ) : r.displayName}
                    </div>
                    <div style={{ fontSize: 10, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif" }}>
                      {r.counties.slice(0, 3).join(', ')}{r.counties.length > 3 ? '…' : ''}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: r.gvaNominal2024 >= nationalData.gvaPerCapita2024 ? C_GREEN : '#1A1916' }}>
                    €{r.gvaNominal2024.toLocaleString()}
                  </td>
                  <td>€{r.disposableIncome2024.toLocaleString()}</td>
                  <td>€{r.rent2024.toLocaleString()}/mo</td>
                  <td>{r.unemployment2024}%</td>
                  <td>{(r.population / 1000).toFixed(0)}k</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 16px', borderTop: '1px solid #F0EDE8' }}>
            <p style={{ fontSize: 11, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif" }}>
              Source: CSO County Incomes and Regional GDP 2024 (GVA, disposable income) · RTB Q2 2024 (rent) · CSO LFS 2024 (unemployment). Green GVA = above national average (€{nationalData.gvaPerCapita2024.toLocaleString()}).
            </p>
          </div>
        </div>
      </section>

      {/* Output chart */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916', marginBottom: 14 }}>
            Output: GVA per person
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
            GVA (Gross Value Added) per person measures economic output. It is a
            production-side measure — it captures the value of goods and services produced
            in a region, not the income that people living there receive. In Dublin and the
            South-West, GVA is significantly inflated by multinational activity.
          </p>
        </div>

        <ChartWrap
          title="GVA per person by NUTS3 region, 2024 (nominal €)"
          meta={`National average: €${nationalData.gvaPerCapita2024.toLocaleString()} — shown as dashed reference line. Dublin (€${dublin.gvaNominal2024.toLocaleString()}) and South-West (€${regionsData.find(r=>r.id==='southwest')?.gvaNominal2024.toLocaleString()}) are the only regions above average.`}
          source="CSO County Incomes and Regional GDP 2024, Table 4.1 — NUTS3 GVA per person, nominal current prices"
          note="Dublin's GVA is significantly inflated by multinational company activity. The South-West similarly reflects large pharmaceutical and tech FDI. GNI* is the more relevant domestic measure but is not available at NUTS3 level."
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sorted.map(r => ({ name: r.shortName, gva: r.gvaNominal2024, above: r.gvaNominal2024 >= nationalData.gvaPerCapita2024 }))} layout="vertical" margin={{ top: 5, right: 90, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} width={90} />
              <Tooltip content={<Tip />} />
              <ReferenceLine x={nationalData.gvaPerCapita2024} stroke={C_GREEN_LIGHT} strokeDasharray="5 4"
                label={{ value: '↑ National avg', position: 'insideTopRight', fontSize: 10, fill: C_AXIS, offset: 6 }} />
              <Bar dataKey="gva" radius={[0, 6, 6, 0]}
                label={{ position: 'right', formatter: v => `€${(v/1000).toFixed(0)}k`, fontSize: 10, fill: C_AXIS }}>
                {sorted.map((r, i) => (
                  <Cell key={i} fill={r.gvaNominal2024 >= nationalData.gvaPerCapita2024 ? C_GREEN : C_GREEN_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrap>
      </section>

      {/* Disposable income */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916', marginBottom: 14 }}>
            What households actually receive
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
            Disposable income — what people actually have to spend after taxes and transfers —
            is far more evenly distributed than GVA. The gap between the highest and lowest
            regions is roughly 1.5× rather than the 5.6× gap in output. This reflects both
            the redistribution effect of the tax and welfare system, and the fact that GVA
            is disproportionately captured by capital rather than labour.
          </p>
        </div>

        <ChartWrap
          title="Disposable income per person by NUTS3 region, 2024 (€)"
          meta="Disposable income is wages, transfers, and benefits minus income taxes and social contributions. It is a more meaningful measure of living standards than GVA."
          source="CSO County Incomes and Regional GDP 2024, Table 3.1 — household disposable income per person"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dispIncome} layout="vertical" margin={{ top: 5, right: 90, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} width={90} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="income" fill={C_GREEN} radius={[0, 6, 6, 0]} name="Disposable income"
                label={{ position: 'right', formatter: v => `€${v.toLocaleString()}`, fontSize: 10, fill: C_AXIS }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrap>
      </section>

      {/* Unemployment */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916' }}>
            Unemployment by region
          </h2>
        </div>
        <ChartWrap
          title="Unemployment rate by NUTS3 region, 2024 (% of labour force)"
          meta="National average: 4.5%. Regional variation is more compressed than output differences, but the Border and West face persistently higher rates."
          source="CSO Labour Force Survey (LFS) Q4 2024 — annual average regional unemployment rate"
          note="Regional unemployment rates are CSO LFS annual averages. Small-area estimates have wider confidence intervals — interpret regional differences cautiously."
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={unemploy} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `${v}%`} domain={[0, 8]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} width={90} />
              <Tooltip content={<Tip prefix="" suffix="%" />} />
              <ReferenceLine x={nationalData.unemployment2024} stroke={C_STONE} strokeDasharray="5 4"
                label={{ value: `Nat. avg ${nationalData.unemployment2024}%`, position: 'top', fontSize: 10, fill: C_AXIS }} />
              <Bar dataKey="rate" name="Unemployment %" radius={[0, 6, 6, 0]}
                label={{ position: 'right', formatter: v => `${v}%`, fontSize: 10, fill: C_AXIS }}>
                {unemploy.map((d, i) => (
                  <Cell key={i} fill={d.rate > nationalData.unemployment2024 ? C_GREEN : C_GREEN_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrap>
      </section>

      {/* Region deep-dive links */}
      <section style={{ paddingBottom: 64 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916' }}>
            Region profiles
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 32 }}>
          {sorted.map(r => (
            <div key={r.id} style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 12, padding: '20px 22px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A8A69F', fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>
                {r.parent}
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1916', fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>
                {r.id === 'dublin' ? (
                  <Link href="/regions/dublin" style={{ color: C_GREEN, textDecoration: 'none' }}>{r.displayName} →</Link>
                ) : r.displayName}
              </div>
              <div style={{ fontSize: 12, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, marginBottom: 12 }}>
                {r.description}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif" }}>GVA/person</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C_GREEN, fontFamily: "'DM Sans', sans-serif" }}>€{(r.gvaNominal2024/1000).toFixed(0)}k</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif" }}>Unemployment</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', fontFamily: "'DM Sans', sans-serif" }}>{r.unemployment2024}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#A8A69F', fontFamily: "'DM Sans', sans-serif" }}>Monthly rent</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1916', fontFamily: "'DM Sans', sans-serif" }}>€{r.rent2024.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #E2DFD8', paddingTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/households" style={{ padding: '10px 18px', background: C_GREEN, color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
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
