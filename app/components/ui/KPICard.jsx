'use client';

// Props: label (string), value (string), sub (string, optional), source (string, optional), trend (string, optional, e.g. "+4.8%")

export default function KPICard({ label, value, sub, source, trend }) {
  const isPositiveTrend = trend && trend.startsWith('+');
  const isNegativeTrend = trend && trend.startsWith('-');

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #E2DFD8',
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        minWidth: '0',
      }}
    >
      {/* Label */}
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '12px',
          color: '#A8A69F',
          fontWeight: 600,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>

      {/* Value + Trend row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#0D6B4F',
            lineHeight: 1.1,
          }}
        >
          {value}
        </span>

        {trend && (
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '999px',
              background: isPositiveTrend
                ? '#EEF6F2'
                : isNegativeTrend
                ? '#FEF2F2'
                : '#F5F4F0',
              color: isPositiveTrend
                ? '#0D6B4F'
                : isNegativeTrend
                ? '#B91C1C'
                : '#6B6860',
              border: isPositiveTrend
                ? '1px solid #B8DCCC'
                : isNegativeTrend
                ? '1px solid #FECACA'
                : '1px solid #E2DFD8',
            }}
          >
            {trend}
          </span>
        )}
      </div>

      {/* Sub */}
      {sub && (
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            color: '#A8A69F',
            lineHeight: 1.45,
          }}
        >
          {sub}
        </div>
      )}

      {/* Spacer to push source to bottom */}
      <div style={{ flex: 1 }} />

      {/* Source */}
      {source && (
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            color: '#C5BFB8',
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid #F0EDE8',
          }}
        >
          {source}
        </div>
      )}
    </div>
  );
}
