'use client';

// Props: source (string), url (string, optional), year (number, optional),
//        table (string, optional), caveat (string, optional)

export default function SourceNote({ source, url, year, table, caveat }) {
  const parts = [];

  // Build the citation segments (table · year appended after the source link)
  if (table) parts.push(table);
  if (year) parts.push(String(year));

  const suffix = parts.length > 0 ? ` · ${parts.join(' · ')}` : '';

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '11px',
        color: '#A8A69F',
        lineHeight: 1.55,
      }}
    >
      <span>
        Source:{' '}
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#A8A69F',
              textDecoration: 'underline',
              textDecorationColor: '#C5BFB8',
              textUnderlineOffset: '2px',
            }}
          >
            {source}
          </a>
        ) : (
          <span>{source}</span>
        )}
        {suffix}
      </span>

      {caveat && (
        <div
          style={{
            marginTop: '6px',
            fontSize: '11px',
            color: '#A8A69F',
            fontStyle: 'italic',
            lineHeight: 1.6,
          }}
        >
          {caveat}
        </div>
      )}
    </div>
  );
}
