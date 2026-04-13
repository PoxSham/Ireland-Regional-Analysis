'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Routes and their display labels
const NAV_ITEMS = [
  { href: '/', label: 'Overview' },
  { href: '/regional-output', label: 'Regional Output' },
  { href: '/household-income', label: 'Household Income' },
  { href: '/fiscal-picture', label: 'Fiscal Picture' },
  { href: '/renewable-energy', label: 'Renewable Energy' },
  { href: '/population', label: 'Population' },
  { href: '/ireland-europe', label: 'Ireland & Europe' },
  { href: '/policy-investment', label: 'Policy & Investment' },
  { href: '/methods-sources', label: 'Methods & Sources' },
];

// Harp SVG mark (simplified geometric harp)
function HarpMark() {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 22 26"
      fill="none"
      aria-label="Irish harp mark"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      {/* Pillar */}
      <rect x="2" y="2" width="3" height="22" rx="1.5" fill="#0D6B4F" />
      {/* Neck / curved top */}
      <path
        d="M5 3 Q18 1 19 14"
        stroke="#0D6B4F"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Strings */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 7 + i * 2;
        const topY = 4 + i * 1.2;
        const bottomY = 22 - i * 0.5;
        return (
          <line
            key={i}
            x1={x}
            y1={topY}
            x2="5"
            y2={bottomY}
            stroke="#0D6B4F"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity={1 - i * 0.08}
          />
        );
      })}
      {/* Base */}
      <rect x="2" y="22" width="17" height="2.5" rx="1.25" fill="#0D6B4F" />
    </svg>
  );
}

export default function SectionNav({ currentPath }) {
  const pathname = usePathname();
  const activePath = currentPath ?? pathname;

  return (
    <>
      {/* Inject minimal global CSS for scrollbar hiding and fade */}
      <style>{`
        .section-nav-tabs {
          overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .section-nav-tabs::-webkit-scrollbar {
          display: none;
        }
        .section-nav-tab-link {
          transition: color 0.15s ease;
        }
        .section-nav-tab-link:hover {
          color: #0D6B4F !important;
        }
      `}</style>

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'white',
          boxShadow: '0 1px 0 #EDEAE4',
        }}
      >
        {/* Logo row */}
        <div
          style={{
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '0 24px',
            borderBottom: '1px solid #EDEAE4',
          }}
        >
          <HarpMark />
          <span
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '17px',
              fontWeight: 400,
              color: '#1A1916',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            Irish Regional Economics
          </span>
        </div>

        {/* Tab bar row */}
        <div style={{ position: 'relative' }}>
          {/* Right-edge scroll fade hint */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '48px',
              background:
                'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          <nav
            className="section-nav-tabs"
            aria-label="Section navigation"
            style={{
              height: '44px',
              display: 'flex',
              alignItems: 'stretch',
              padding: '0 16px',
              borderBottom: '1px solid #EDEAE4',
              gap: '0',
            }}
          >
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive =
                href === '/'
                  ? activePath === '/'
                  : activePath === href || activePath?.startsWith(href + '/');

              return (
                <Link
                  key={href}
                  href={href}
                  className="section-nav-tab-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0 14px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13.5px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#0D6B4F' : '#6B6860',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    borderBottom: isActive
                      ? '2px solid #0D6B4F'
                      : '2px solid transparent',
                    marginBottom: '-1px',
                    flexShrink: 0,
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
