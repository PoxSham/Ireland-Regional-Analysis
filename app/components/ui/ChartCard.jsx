'use client';

// Props: title (string), subtitle (string, optional), source (string), note (string, optional),
//        geography (string, optional), year (number, optional), children (ReactNode)

export default function ChartCard({
  title,
  subtitle,
  source,
  note,
  geography,
  year,
  children,
}) {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #E2DFD8',
        borderRadius: '12px',
        padding: '24px 24px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '4px' }}>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '18px',
            fontWeight: 600,
            color: '#1A1916',
            margin: '0',
            lineHeight: 1.25,
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              color: '#6B6860',
              margin: '6px 0 0 0',
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Chart children */}
      <div style={{ marginTop: '20px', marginBottom: '16px' }}>{children}</div>

      {/* Footer meta */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          borderTop: '1px solid #F0EDE8',
          paddingTop: '12px',
          marginTop: '4px',
        }}
      >
        {source && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px',
              color: '#A8A69F',
              margin: '0',
            }}
          >
            Source: {source}
          </p>
        )}

        {(geography || year) && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px',
              color: '#A8A69F',
              margin: '0',
            }}
          >
            {geography && year
              ? `Geography: ${geography} · Year: ${year}`
              : geography
              ? `Geography: ${geography}`
              : `Year: ${year}`}
          </p>
        )}

        {note && (
          <div
            style={{
              marginTop: '8px',
              padding: '10px 14px',
              background: '#F9F8F4',
              border: '1px solid #EDEAE4',
              borderRadius: '6px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              color: '#6B6860',
              lineHeight: 1.55,
              fontStyle: 'italic',
            }}
          >
            {note}
          </div>
        )}
      </div>
    </div>
  );
}
