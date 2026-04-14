'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/ireland-on-paper', label: 'Ireland on Paper' },
  { href: '/taxes-and-spending', label: 'Taxes & Spending' },
  { href: '/ireland-europe', label: 'Ireland vs EU' },
  { href: '/regions', label: 'Regions' },
  { href: '/households', label: 'Households' },
  { href: '/methods-sources', label: 'Methods' },
];

// Subtle geometric harp mark
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

// Hamburger icon
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
        .nav-tabs { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .nav-tabs::-webkit-scrollbar { display: none; }
        .nav-tab { transition: color 0.15s ease; }
        .nav-tab:hover { color: #0D6B4F !important; }
        .mobile-menu a:hover { background: #F5F4F0 !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'white', boxShadow: '0 1px 0 #EDEAE4',
      }}>
        {/* Main header row */}
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
              color: '#1A1916', letterSpacing: '-0.01em',
              lineHeight: 1,
            }}>
              Irish Data Platform
            </span>
          </Link>

          {/* Desktop nav tabs */}
          <nav className="desktop-nav nav-tabs" aria-label="Site navigation" style={{
            display: 'flex', alignItems: 'stretch',
            height: '100%', gap: 0, flex: 1,
            justifyContent: 'flex-end',
          }}>
            {NAV_ITEMS.map(({ href, label }) => (
              <Link key={href} href={href} className="nav-tab"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '0 13px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px', fontWeight: isActive(href) ? 600 : 400,
                  color: isActive(href) ? '#0D6B4F' : '#6B6860',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                  borderBottom: isActive(href) ? '2px solid #0D6B4F' : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="mobile-toggle"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px', display: 'none', alignItems: 'center',
            }}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <nav className="mobile-menu" style={{
            background: 'white', borderTop: '1px solid #EDEAE4',
            padding: '8px 0', display: 'flex', flexDirection: 'column',
          }}>
            {NAV_ITEMS.map(({ href, label }) => (
              <Link key={href} href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block', padding: '12px 24px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15, fontWeight: isActive(href) ? 600 : 400,
                  color: isActive(href) ? '#0D6B4F' : '#1A1916',
                  textDecoration: 'none',
                  background: isActive(href) ? '#EEF6F2' : 'transparent',
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
