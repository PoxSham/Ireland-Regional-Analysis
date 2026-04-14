'use client';

// Props: title, takeaway, lastUpdated, badge
export default function PageHero({ title, takeaway, lastUpdated, badge }) {
  return (
    <div style={{ paddingTop: 56, paddingBottom: 48, maxWidth: 900 }}>
      {badge && (
        <div style={{
          display: 'inline-block', marginBottom: 14,
          padding: '3px 12px',
          background: '#EEF6F2', border: '1px solid #B8DCCC',
          borderRadius: 999,
          fontSize: 10, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: '#0D4A36',
        }}>
          {badge}
        </div>
      )}

      <h1 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 'clamp(26px, 4vw, 42px)',
        fontWeight: 400, lineHeight: 1.15,
        color: '#1A1916', margin: '0 0 16px',
        letterSpacing: '-0.015em',
      }}>
        {title}
      </h1>

      {takeaway && (
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 17, lineHeight: 1.72,
          color: '#4A4740', margin: '0 0 14px',
          maxWidth: 720,
        }}>
          {takeaway}
        </p>
      )}

      {lastUpdated && (
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: '#A8A69F', margin: 0,
        }}>
          Data: {lastUpdated}
        </p>
      )}
    </div>
  );
}
