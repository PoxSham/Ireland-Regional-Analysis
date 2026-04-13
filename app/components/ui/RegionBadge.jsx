'use client';

import { useState } from 'react';

// Props: region (object with id, shortName, color), linkTo (string, optional)

export default function RegionBadge({ region, linkTo }) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        background: hovered ? '#F9F8F4' : 'white',
        border: '1px solid #E2DFD8',
        borderRadius: '999px',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '12px',
        color: '#1A1916',
        lineHeight: 1.4,
        cursor: linkTo ? 'pointer' : 'default',
        textDecoration: 'none',
        transition: 'background 0.12s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Colored dot */}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: region?.color ?? '#A8A69F',
          flexShrink: 0,
        }}
      />
      {region?.shortName ?? region?.id ?? ''}
    </span>
  );

  if (linkTo) {
    return (
      <a
        href={linkTo}
        style={{ textDecoration: 'none', display: 'inline-block' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {inner}
      </a>
    );
  }

  return (
    <span
      style={{ display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </span>
  );
}
