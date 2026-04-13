'use client';

// Props: children (ReactNode), variant ('info' | 'warning' | 'finding'), icon (string, optional)

const VARIANT_STYLES = {
  info: {
    background: '#F9F8F4',
    border: '1px solid #EDEAE4',
    color: '#4A4740',
  },
  warning: {
    background: '#FEF9EC',
    border: '1px solid #F5D06A',
    color: '#7A5C00',
  },
  finding: {
    background: '#EEF6F2',
    border: '1px solid #B8DCCC',
    color: '#0D4A36',
  },
};

export default function Callout({ children, variant = 'info', icon }) {
  const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.info;

  return (
    <div
      style={{
        background: styles.background,
        border: styles.border,
        borderRadius: '8px',
        padding: '16px 20px',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        lineHeight: 1.65,
        color: styles.color,
        display: 'flex',
        alignItems: 'flex-start',
        gap: icon ? '10px' : '0',
      }}
    >
      {icon && (
        <span
          aria-hidden="true"
          style={{
            fontSize: '16px',
            lineHeight: '1.4',
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      )}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
