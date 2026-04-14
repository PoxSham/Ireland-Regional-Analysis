'use client';

import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line,
} from 'recharts';
import nationalData from '../data/national.json';

export const dynamic = 'force-static';

const C_GREEN       = '#0D6B4F';
const C_GREEN_DARK  = '#0A5440';
const C_GREEN_LIGHT = '#7FA896';
const C_STONE       = '#B5A899';
const C_MUTED       = '#C5CCC9';
const C_AXIS        = '#6B6860';
const C_GRID        = '#F0EDE8';

const SPEND_COLORS = [C_GREEN, C_GREEN_LIGHT, '#4A90A4', '#7FA896', '#6B7C5E', C_STONE, C_MUTED, '#E2DFD8'];

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

export default function TaxesSpendingPage() {
  const taxData = nationalData.taxBreakdown2024;
  const spendData = nationalData.govSpendingBreakdown2024;

  const debtData = Object.entries(nationalData.debtHistory.grossBn).map(([yr, gross]) => ({
    year: yr,
    'Gross Debt (€bn)': gross,
  }));

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
          Taxes & Spending · National · 2024
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400,
          lineHeight: 1.15, color: '#1A1916', marginBottom: 18,
          maxWidth: 760, letterSpacing: '-0.015em',
        }}>
          Ireland collected €126bn in taxes in 2024.<br />
          One in four euros came from multinationals.
        </h1>

        <p style={{ fontSize: 17, lineHeight: 1.72, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
          Ireland runs a fiscal surplus — spending less than it takes in — which is unusual
          among EU countries. That surplus exists largely because corporation tax from a
          small group of US technology and pharmaceutical companies has flooded the exchequer
          beyond what policymakers expected or planned for.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.72, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif", marginBottom: 0 }}>
          That creates a structural problem: a revenue base that is both highly concentrated
          and potentially fragile. If a small number of multinationals restructure, leave, or
          face a changed international tax regime, the fiscal position could deteriorate rapidly.
          Meanwhile, the spending side of the ledger shows a government still struggling to
          deliver enough housing, healthcare, and public infrastructure despite the windfall.
        </p>
      </section>

      {/* KPI row */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Budget Surplus 2024', value: `€${nationalData.surplus2024Bn}bn`, sub: 'General government balance — Dept of Finance / IFAC' },
            { label: 'Total Tax Revenue', value: `€${nationalData.totalTaxRevenue2024Bn}bn`, sub: '2024 outturn — Revenue Commissioners' },
            { label: 'Corporation Tax', value: `€${nationalData.ctRevenue2024Bn}bn`, sub: `${nationalData.ctAsShareOfTax}% of all taxes — Revenue Commissioners` },
            { label: 'Total Expenditure', value: `€${nationalData.totalGovSpending2024Bn}bn`, sub: 'General government spending — CSO GFS 2024' },
            { label: 'Gross National Debt', value: `€${nationalData.grossDebt2024Bn}bn`, sub: `${nationalData.debtAsShareOfGdp}% GDP · ${nationalData.debtAsShareOfGniStar}% GNI* — NTMA/CSO` },
            { label: 'Debt per Capita', value: `€${nationalData.debtPerCapita.toLocaleString()}`, sub: 'Per person, gross debt · 2024' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{ background: 'white', border: '1px solid #E2DFD8', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#A8A69F', fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: C_GREEN, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1, marginBottom: 6 }}>{value}</div>
              <div style={{ fontSize: 11, color: '#6B6860', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.45 }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Where taxes come from */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916', marginBottom: 14 }}>
            Where the money comes from
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
            Income tax (including USC) and corporation tax together account for nearly half
            of all tax revenue. The extraordinary rise of corporation tax — from under 10%
            of revenues in 2014 to 22% in 2024 — is without precedent among EU economies
            of comparable size.
          </p>
        </div>

        <ChartWrap
          title="Tax revenue by category, 2024 — €bn and % share"
          meta={`Total: €${nationalData.totalTaxRevenue2024Bn}bn. Corporation tax (€${nationalData.ctRevenue2024Bn}bn, ${nationalData.ctAsShareOfTax}%) now exceeds VAT as a revenue source. Income tax + USC accounts for the largest single category at 24% of total.`}
          source="CSO Tax Revenue Statistics 2024 / Revenue Commissioners"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taxData} layout="vertical" margin={{ top: 0, right: 100, left: 10, bottom: 0 }}>
              <CartesianGrid stroke={C_GRID} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${v}bn`} />
              <YAxis type="category" dataKey="tax" tick={{ fontSize: 11, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} width={165} />
              <Tooltip content={<Tip prefix="€" suffix="bn" />} />
              <Bar dataKey="amountBn" name="Revenue (€bn)" radius={[0, 6, 6, 0]}
                label={{ position: 'right', formatter: (v, _, idx) => `€${v}bn · ${taxData[idx]?.pct}%`, fontSize: 10, fill: C_AXIS }}>
                {taxData.map((d, i) => (
                  <Cell key={i} fill={d.tax === 'Corporation Tax' ? '#0A5440' : i < 3 ? C_GREEN : C_GREEN_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrap>

        {/* CT concentration callout */}
        <div style={{
          background: '#FEF9EC', border: '1px solid #F5D06A',
          borderRadius: 10, padding: '20px 24px', marginBottom: 28,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#7A5C00', marginBottom: 8 }}>
            Corporation tax concentration risk
          </div>
          <p style={{ fontSize: 14, color: '#7A5C00', lineHeight: 1.7, marginBottom: 8 }}>
            The top 3 multinationals pay <strong>{nationalData.ctTop3Share}%</strong> of all
            corporation tax receipts. The top 10 pay <strong>{nationalData.ctTop10Share}%</strong>.
            Foreign-owned companies account for <strong>{nationalData.ctForeignMncShare}%</strong> of
            all CT revenue. This concentration is exceptional by international standards
            and represents a significant structural fiscal risk.
          </p>
          <p style={{ fontSize: 13, color: '#9A7500', lineHeight: 1.6 }}>
            The OECD Pillar Two global minimum tax (15%) began taking effect in 2024. While
            Ireland already applies a 15% rate to in-scope groups, the longer-term effect on
            profit-booking behaviour remains uncertain. IFAC has warned that the government
            should treat current CT windfalls as non-recurring.
          </p>
        </div>
      </section>

      {/* Where money goes */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916', marginBottom: 14 }}>
            Where it goes
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
            Total government expenditure reached €{nationalData.totalGovSpending2024Bn}bn in 2024.
            Social protection and health together account for nearly half of all spending.
            Housing (€8.3bn) and transport (€3.6bn) remain relatively small shares despite
            the severity of both crises.
          </p>
        </div>

        <ChartWrap
          title="Government spending by category, 2024 — €bn"
          meta="Total expenditure: €116.1bn. Social protection (€27bn) and health (€24.6bn) dominate. The combined debt and EU contribution line (€12.7bn) reflects Ireland's legacy debt burden and EU budget contributions."
          source="CSO Government Finance Statistics (GFS) Oct 2025"
          note="Housing (€8.3bn, 7.1% of spending) reflects current-year Exchequer investment plus capital transfers. It does not capture all housing-related activity (e.g. HAP, RAS, and LDA off-balance-sheet commitments)."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendData} layout="vertical" margin={{ top: 0, right: 80, left: 10, bottom: 0 }}>
              <CartesianGrid stroke={C_GRID} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${v}bn`} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: C_AXIS, fontFamily: "'DM Sans', sans-serif" }} width={130} />
              <Tooltip content={<Tip prefix="€" suffix="bn" />} />
              <Bar dataKey="amountBn" name="Spending (€bn)" radius={[0, 6, 6, 0]}
                label={{ position: 'right', formatter: v => `€${v}bn`, fontSize: 10, fill: C_AXIS }}>
                {spendData.map((d, i) => (
                  <Cell key={i} fill={SPEND_COLORS[i % SPEND_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrap>
      </section>

      {/* Debt */}
      <section style={{ paddingBottom: 64 }}>
        <div style={{ borderTop: '2px solid #1A1916', paddingTop: 28, marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1916', marginBottom: 14 }}>
            The debt position
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
            Ireland's gross debt of €{nationalData.grossDebt2024Bn}bn has fallen steadily as
            a share of GDP (now 38%) — but this is partly the denominator effect of GDP
            inflation. Against GNI*, the more honest denominator, debt stands at 67%.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#4A4740', maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
            Net debt (after subtracting financial assets held by the Ireland Strategic
            Investment Fund, the NTMA, and the new future fund) stands at €{nationalData.netDebt2024Bn}bn.
            Ireland is in a materially strong fiscal position — but that position rests partly
            on revenue that IFAC considers non-recurring.
          </p>
        </div>

        <ChartWrap
          title="Gross national debt, €bn, 2019–2024"
          meta="Debt peaked at €236bn in 2021 before declining. The fall reflects both repayments and GDP denominator growth. The key risk is a CT revenue reversal that forces deficit spending while debt markets are less accommodating."
          source="CSO Government Finance Statistics Oct 2025 — gross general government debt, €bn"
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={debtData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid stroke={C_GRID} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: C_AXIS }} />
              <YAxis tick={{ fontSize: 11, fill: C_AXIS }} tickFormatter={v => `€${v}bn`} />
              <Tooltip content={<Tip prefix="€" suffix="bn" />} />
              <Bar dataKey="Gross Debt (€bn)" fill={C_GREEN} radius={[4,4,0,0]}
                label={{ position: 'top', formatter: v => `€${v}bn`, fontSize: 10, fill: C_AXIS }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrap>

        <div style={{ borderTop: '1px solid #E2DFD8', paddingTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/ireland-on-paper" style={{ padding: '10px 18px', background: 'white', color: C_GREEN, border: '1px solid #B8DCCC', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            Ireland on Paper →
          </Link>
          <Link href="/methods-sources" style={{ padding: '10px 18px', background: 'white', color: '#4A4740', border: '1px solid #E2DFD8', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            Methods & Sources →
          </Link>
        </div>
      </section>
    </div>
  );
}
