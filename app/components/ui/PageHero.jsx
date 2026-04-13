'use client';

// Props: title (string), takeaway (string), lastUpdated (string, optional), badge (string, optional)

export default function PageHero({ title, takeaway, lastUpdated, badge }) {
  return (
    <div
      style={{
        paddingTop: '48px',
        paddingBottom: '40px',
        paddingLeft: '0',
        paddingRight: '0',
        maxWidth: '900px',
      }}
    >
      {badge && (
        <div
          style={{
            display: 'inline-block',
            marginBottom: '14px',
            padding: '4px 12px',
            background: '#EEF6F2',
            border: '1px solid #B8DCCC',
            borderRadius: '999px',
            fontSize: '11px',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#0D4A36',
          }}
        >
          {badge}
        </div>
      )}

      <h1
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '36px',
          fontWeight: 400,
          lineHeight: 1.18,
          color: '#1A1916',
          margin: '0 0 16px 0',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h1>

      {takeaway && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            lineHeight: 1.65,
            color: '#6B6860',
            margin: '0 0 14px 0',
            maxWidth: '720px',
          }}
        >
          {takeaway}
        </p>
      )}

      {lastUpdated && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            color: '#A8A69F',
            margin: '0',
          }}
        >
          Data: {lastUpdated}
        </p>
      )}
    </div>
  );
}
