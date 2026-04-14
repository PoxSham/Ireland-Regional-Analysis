'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

// Full nav structure — top-level items and their children
const NAV = [
  { href: '/', label: 'Home' },
  {
    label: 'Ireland',
    children: [
      { href: '/ireland-on-paper', label: 'Ireland on Paper', desc: 'GDP vs GNI* — the statistical distortion' },
      { href: '/taxes-and-spending', label: 'Taxes & Spending', desc: 'Where €126bn comes from and where it goes' },
      { href: '/population', label: 'Population', desc: 'Regional population trends and projections' },
    ],
  },
  {
    label: 'Regions',
    children: [
      { href: '/regions', label: 'All Regions', desc: 'Overview of all 7 NUTS3 regions' },
      { href: '/households', label: 'Households & Rent', desc: 'Income, rent burden, and purchasing power' },
      { href: '/regions/dublin', label: 'Dublin', desc: '' },
      { href: '/regions/south-west', label: 'South-West', desc: '' },
      { href: '/regions/mid-east', label: 'Mid-East', desc: '' },
      { href: '/regions/south-east', label: 'South-East', desc: '' },
      { href: '/regions/west', label: 'West', desc: '' },
      { href: '/regions/border', label: 'Border', desc: '' },
      { href: '/regions/midlands', label: 'Midlands', desc: '' },
    ],
  },
  {
    label: 'Comparisons',
    children: [
      { href: '/ireland-europe', label: 'Ireland vs EU', desc: 'PPS comparison — countries and regions' },
      { href: '/renewable-energy', label: 'Renewable Energy', desc: 'Wind capacity and grid constraints by county' },
      { href: '/policy-investment', label: 'Policy & Investment', desc: 'NDP allocations and infrastructure gaps' },
    ],
  },
  { href: '/methods-sources', label: 'Methods' },
];

function HarpMark() {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
      <rect x="1.5" y="2" width="2.5" height="19" rx="1.25" fill="#0D6B4F" />
      <path d="M4 3 Q16 1.5 17 13" stroke="#0D6B4F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {[0,1,2,3,4,5].map(i => (
        <line key={i}
          x1={6 + i*1.8} y1={4 + i*1.1}
          x2="4" y2={19 - i*0.4}
          stroke="#0D6B4F" strokeWidth="1.1"
          strokeLinecap="round" opacity={0.95 - i*0.08}
        />
      ))}
      <rect x="1.5" y="20" width="15" height="2" rx="1" fill="#0D6B4F" />
    </svg>
  );
}

function ChevronDown({ size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden="true" style={{ marginLeft: 3, flexShrink: 0 }}>
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {open ? (
        <>
          <line x1="4" y1="4" x2="16" y2="16" stroke="#1A1916" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="16" y1="4" x2="4" y2="16" stroke="#1A1916" strokeWidth="1.8" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="17" y2="6" stroke="#1A1916" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="3" y1="10" x2="17" y2="10" stroke="#1A1916" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="3" y1="14" x2="17" y2="14" stroke="#1A1916" strokeWidth="1.8" strokeLinecap="round"/>
        </>
      )}
    </svg>
  );
}

// Desktop dropdown menu
function Dropdown({ item, pathname, closeAll }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isActive = item.children?.some(c =>
    pathname === c.href || pathname?.startsWith(c.href + '/')
  );

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'stretch' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center',
          padding: '0 13px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '13px',
          fontWeight: isActive ? 600 : 400,
          color: isActive ? '#0D6B4F' : open ? '#0D6B4F' : '#6B6860',
          whiteSpace: 'nowrap',
          borderBottom: isActive ? '2px solid #0D6B4F' : open ? '2px solid #B8DCCC' : '2px solid transparent',
          marginBottom: '-1px',
          transition: 'color 0.15s',
        }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          minWidth: item.label === 'Regions' ? 520 : 300,
          background: 'white',
          border: '1px solid #E2DFD8',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          zIndex: 200,
          padding: '8px',
          display: 'grid',
          gridTemplateColumns: item.label === 'Regions' ? 'repeat(3, 1fr)' : '1fr',
          gap: 2,
        }}>
          {item.children.map(child => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '10px 14px',
                borderRadius: 7,
                textDecoration: 'none',
                background: pathname === child.href ? '#EEF6F2' : 'transparent',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { if (pathname !== child.href) e.currentTarget.style.background = '#F9F8F4'; }}
              onMouseLeave={e => { if (pathname !== child.href) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: pathname === child.href ? 600 : 500,
                color: pathname === child.href ? '#0D6B4F' : '#1A1916',
                lineHeight: 1.3,
              }}>
                {child.label}
              </div>
              {child.desc && (
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, color: '#A8A69F',
                  marginTop: 2, lineHeight: 1.4,
                }}>
                  {child.desc}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Mobile accordion section
function MobileSection({ item, pathname, onClose }) {
  const [open, setOpen] = useState(false);
  const isActive = item.children?.some(c => pathname === c.href || pathname?.startsWith(c.href + '/'));

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 24px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, fontWeight: isActive ? 600 : 400,
          color: isActive ? '#0D6B4F' : '#1A1916',
          cursor: 'pointer',
          background: isActive ? '#EEF6F2' : 'transparent',
        }}
      >
        {item.label}
        <ChevronDown size={12} />
      </button>

      {open && (
        <div style={{ background: '#F9F8F4', borderTop: '1px solid #EDEAE4', borderBottom: '1px solid #EDEAE4' }}>
          {item.children.map(child => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              style={{
                display: 'block',
                padding: '11px 32px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: pathname === child.href ? 600 : 400,
                color: pathname === child.href ? '#0D6B4F' : '#4A4740',
                textDecoration: 'none',
                borderBottom: '1px solid #EDEAE4',
              }}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SectionNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <>
      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile-toggle { display: none !important; }
        .nav-mobile-menu { display: none !important; }
        @media (max-width: 860px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
          .nav-mobile-menu { display: block !important; }
        }
      `}</style>

      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'white', boxShadow: '0 1px 0 #EDEAE4',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          height: 52, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px', gap: 16,
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 9,
            textDecoration: 'none', flexShrink: 0,
          }}>
            <HarpMark />
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 16, fontWeight: 400,
              color: '#1A1916', letterSpacing: '-0.01em', lineHeight: 1,
            }}>
              Irish Data Platform
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" aria-label="Site navigation" style={{
            display: 'flex', alignItems: 'stretch',
            height: '100%', gap: 0, flex: 1, justifyContent: 'flex-end',
          }}>
            {NAV.map(item => {
              if (item.children) {
                return <Dropdown key={item.label} item={item} pathname={pathname} />;
              }
              return (
                <Link key={item.href} href={item.href}
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '0 13px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px', fontWeight: isActive(item.href) ? 600 : 400,
                    color: isActive(item.href) ? '#0D6B4F' : '#6B6860',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                    borderBottom: isActive(item.href) ? '2px solid #0D6B4F' : '2px solid transparent',
                    marginBottom: '-1px',
                    transition: 'color 0.15s',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            className="nav-mobile-toggle"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px', alignItems: 'center',
            }}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="nav-mobile-menu" style={{
            background: 'white',
            borderTop: '1px solid #EDEAE4',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}>
            {NAV.map(item => {
              if (item.children) {
                return <MobileSection key={item.label} item={item} pathname={pathname} onClose={() => setMobileOpen(false)} />;
              }
              return (
                <Link key={item.href} href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block', padding: '13px 24px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15, fontWeight: isActive(item.href) ? 600 : 400,
                    color: isActive(item.href) ? '#0D6B4F' : '#1A1916',
                    textDecoration: 'none',
                    background: isActive(item.href) ? '#EEF6F2' : 'transparent',
                    borderBottom: '1px solid #EDEAE4',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>
    </>
  );
}
