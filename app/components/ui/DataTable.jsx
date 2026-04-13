'use client';

import { useState } from 'react';

// Props: columns (array of {key, label, align?}), rows (array of objects),
//        source (string, optional), caption (string, optional)

export default function DataTable({ columns = [], rows = [], source, caption }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div
        style={{
          background: 'white',
          border: '1px solid #E2DFD8',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* Header */}
          <thead>
            <tr style={{ background: '#F5F4F0' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: '10px 16px',
                    textAlign: col.align === 'right' ? 'right' : col.align === 'center' ? 'center' : 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#6B6860',
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #E2DFD8',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onMouseEnter={() => setHoveredRow(rowIndex)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  background: hoveredRow === rowIndex ? '#FAFAF8' : 'white',
                  transition: 'background 0.12s ease',
                  borderBottom:
                    rowIndex < rows.length - 1 ? '1px solid #F0EDE8' : 'none',
                }}
              >
                {columns.map((col) => {
                  const isNumeric =
                    col.align === 'right' ||
                    (col.align == null && typeof row[col.key] === 'number');
                  return (
                    <td
                      key={col.key}
                      style={{
                        padding: '11px 16px',
                        fontSize: '14px',
                        color: '#1A1916',
                        textAlign: col.align === 'right' ? 'right' : col.align === 'center' ? 'center' : isNumeric ? 'right' : 'left',
                        fontVariantNumeric: 'tabular-nums',
                        lineHeight: 1.45,
                      }}
                    >
                      {row[col.key] ?? '—'}
                    </td>
                  );
                })}
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#A8A69F',
                  }}
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Caption */}
      {caption && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            color: '#A8A69F',
            margin: '0',
            lineHeight: 1.5,
          }}
        >
          {caption}
        </p>
      )}

      {/* Source */}
      {source && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            color: '#A8A69F',
            margin: '0',
            lineHeight: 1.5,
          }}
        >
          {source}
        </p>
      )}
    </div>
  );
}
