'use client';

import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import regionsData from '../data/regions.json';

export const dynamic = 'force-static';

const C_GREEN       = '#0D6B4F';
const C_GREEN_LIGHT = '#7FA896';
const C_STONE       = '#B5A899';
const C_WARN        = '#D97706';
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

export default function HouseholdsPage() {
  const dublin = regionsData.find(r => r.id === 'dublin');
  const west   = regionsData.find(r => r.id === 'west');
  const border = regionsData.find(r => r.id === 'northwest');

  // Sorted income + rent comparison
  const incomeRent = [...regionsData]
    .map(r => ({
      name: r.shortName,
      income: r.disposableIncome2024,
      annualRent: r.rent2024 * 12,
      afterRent: r.disposableIncome2024 - r.rent2024 * 12,
    }))
    .sort((a, b) => b.income - a.income);

  // Rent-to-income ratio
  const rentRatio = [...regionsData]
    .map(r => ({ name: r.shortName, ratio: r.rentToIncome, id: r.id }))
    .sort((a, b) => b.ratio - a.ratio);

  // After-rent purchasing power
  const afterRent = [...regionsData]
    .map(r => ({
      name: r.shortName,
      power: r.disposableIncome2024 - r.rent2024 * 12,
    }))
    .sort((a, b) => b.power - a.power);

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
          Households & Cost of Living · 2024
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400,
          lineHeight: 1.15, color: '#1A1916', marginBottom: 18,
          maxWidth: 760, letterSpacing: '-0.015em',
        }}>
          Dublin's income advantage disappears when you factor in housing costs.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.72, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
          Disposable income per person is higher in Dublin than anywhere else in Ireland.
          But rent in Dublin consumes {dublin.rentToIncome}% of that income — far above the
          EU benchmark of 30% for cost-burdened households. After housing costs, the
          West and South-East offer more residual purchasing power than the capital.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.72, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
          This does not mean people are better off living outside Dublin — wages, job
          opportunities, and public services are all weaker in most other regions. But it
          does mean the assumption that Dublin is clearly superior in living standards
          deserves scrutiny.
        </p>
      </section>

      {/* KPIs */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { label: 'Dublin disposable income', value: `€${dublin.disposableIncome2024.toLocaleString()}`, sub: 'Per person, 2024 · CSO Table 3.1' },
            { label: 'Dublin rent (new tenancy)', value: `€${dublin.rent2024.toLocaleString()}/mo`, sub: `€${(dublin.rent2024*12).toLocaleString()} annually · RTB Q2 2024` },
            { label: 'Dublin rent-to-income', value: `${dublin.rentToIncome}%`, sub: 'Annual rent as % of disposable income — EU cost-burdened threshold: 30%' },
            { label: 'Dublin after-rent income', value: `€${(dublin.disposableIncome2024 - dublin.rent2024*12).toLocaleString()}`, sub: 'Annual income remaining after rent' },
            { label: 'West after-rent income', value: `€${(west.disposableIncome2024 - west.rent2024*12).toLocaleString()}`, sub: `€${(west.disposableIncome2024 - west.rent2024*12 - (dublin.disposableIncome2024 - dublin.rent2024*12)).toLocaleString()} more than Dublin after rent` },
            { label: 'Border disposable income', value: `€${border.disposableIncome2024.toLocaleString()}`, sub: 'Lowest of any region · CSO Table 3.1' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#A8A69F', fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C_GREEN, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1, marginBottom: 6 }}>{value}</div>
              <div style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.45 }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Housing cost burden */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916', marginBottom: 14 }}>
            The rent burden
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
            Rent data is from the Residential Tenancies Board's Q2 2024 Rent Index — mean
            new tenancy rents by region. These are new-tenancy figures. Households in
            existing tenancies often pay less, but face the new-tenancy rate when they move.
            The rent-to-income ratio uses annual rent against annual CSO disposable income.
          </p>
        </div>

        <ChartWrap
          title="Rent-to-income ratio by region, 2024 (%)"
          meta="Annual new tenancy rent as a percentage of annual disposable income per person. The EU 30% threshold for 'cost-burdened' housing is shown as a reference line."
          source="RTB Rent Index Q2 2024 (mean new tenancy rent) · CSO County Incomes 2024 Table 3.1 (disposable income)"
          note="Rent figures are mean new tenancy rents — not renewal rents. The ratio uses per-person disposable income as the denominator, which understates the burden for single-person households and overstates it for multi-person households sharing a single rental unit."
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={rentRatio} layout="vertical" margin={{ top: 5, right: 70, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `${v}%`} domain={[0, 90]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} width={90} />
              <Tooltip content={<Tip prefix="" suffix="%" />} />
              <ReferenceLine x={30} stroke={C_STONE} strokeDasharray="5 4"
                label={{ value: '30% threshold', position: 'top', fontSize: 10, fill: C_AXIS }} />
              <Bar dataKey="ratio" name="Rent / income" radius={[0, 6, 6, 0]}
                label={{ position: 'right', formatter: v => `${v}%`, fontSize: 10, fill: C_AXIS }}>
                {rentRatio.map((d, i) => (
                  <Cell key={i} fill={d.ratio > 60 ? '#DC2626' : d.ratio > 40 ? C_WARN : C_GREEN} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrap>

        {/* Dublin affordability callout */}
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '16px 20px', marginBottom: 28,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#7F1D1D', lineHeight: 1.65,
        }}>
          <strong>Dublin housing affordability crisis:</strong> At {dublin.rentToIncome}%
          rent-to-income, a Dublin renter spending the mean new tenancy rent is allocating
          more than three-quarters of their disposable income to housing. The EU considers
          30% the threshold for housing stress. By that standard, virtually every new Dublin
          rental household is in housing distress. This is not a cyclical spike — it reflects
          a structural supply failure that has persisted since 2015.
        </div>
      </section>

      {/* After-rent purchasing power */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916', marginBottom: 14 }}>
            After-rent purchasing power
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
            Disposable income minus annual rent shows what a renting household has left
            for everything else. This is an imperfect measure — many households own or have
            subsidised rents — but it illustrates the structural compression of living
            standards for renters in high-cost areas.
          </p>
        </div>

        <ChartWrap
          title="Annual income after rent — regional comparison (€/year)"
          meta="Calculated as: CSO disposable income per person (2024) minus RTB mean annual new tenancy rent (2024 × 12). Lower figure = more of income consumed by housing."
          source="CSO County Incomes 2024 Table 3.1 · RTB Q2 2024 Rent Index"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={afterRent} layout="vertical" margin={{ top: 5, right: 100, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} width={90} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="power" name="After-rent income" radius={[0, 6, 6, 0]}
                label={{ position: 'right', formatter: v => `€${v.toLocaleString()}`, fontSize: 10, fill: C_AXIS }}>
                {afterRent.map((d, i) => (
                  <Cell key={i} fill={d.name === 'Dublin' ? '#DC2626' : C_GREEN} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrap>
      </section>

      {/* Disposable income vs annual rent */}
      <section style={{ paddingBottom: 64 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916' }}>
            Income and rent side by side
          </h2>
        </div>

        <ChartWrap
          title="Disposable income vs annual rent by region, 2024 (€/year)"
          meta="Annual rent = monthly RTB rent × 12. The gap between bars shows after-rent residual income. Dublin's higher income is almost entirely consumed by rent."
          source="CSO County Incomes 2024 Table 3.1 (disposable income) · RTB Q2 2024 (rent)"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={incomeRent}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid stroke={C_GRID} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} />
              <YAxis tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="income" name="Disposable income" fill={C_GREEN} radius={[4,4,0,0]} />
              <Bar dataKey="annualRent" name="Annual rent" fill={C_STONE} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 12, background: C_GREEN, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif" }}>Disposable income per person (annual)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 12, background: C_STONE, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif" }}>Annual new tenancy rent (RTB Q2 2024 × 12)</span>
            </div>
          </div>
        </ChartWrap>

        <div style={{ borderTop: '1px solid #E2DFD8', paddingTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/regions" style={{ padding: '10px 18px', background: C_GREEN, color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            Regions overview →
          </Link>
          <Link href="/methods-sources" style={{ padding: '10px 18px', background: 'white', color: '#4A4740', border: '1px solid #E2DFD8', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            Data & methods →
          </Link>
        </div>
      </section>
    </div>
  );
}
