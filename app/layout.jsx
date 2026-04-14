import './globals.css';
import SectionNav from './components/ui/SectionNav';
import Link from 'next/link';

export const metadata = {
  title: {
    template: '%s | Irish Data Platform',
    default: 'Irish Data Platform — Public Finance & Regional Economics',
  },
  description:
    'Where Irish tax money comes from, where it goes, and how the national picture distorts what is really happening in every region. Data from CSO, Eurostat, IFAC, and RTB.',
  keywords: 'Ireland, public finance, regional economics, GVA, CSO, GNI*, NUTS3, Eurostat, PPS, corporation tax, household income',
  openGraph: {
    title: 'Irish Data Platform — Public Finance & Regional Economics',
    description:
      'Making Irish economic and public-finance data understandable. From where your taxes come from to why Ireland looks wealthier than it is.',
    type: 'website',
    siteName: 'Irish Data Platform',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F5F4F0',
};

const FOOTER_LINKS = [
  { section: 'Analysis', links: [
    { href: '/ireland-on-paper', label: 'Ireland on Paper' },
    { href: '/taxes-and-spending', label: 'Taxes & Spending' },
    { href: '/ireland-europe', label: 'Ireland vs EU' },
  ]},
  { section: 'Regions', links: [
    { href: '/regions', label: 'All Regions' },
    { href: '/regions/dublin', label: 'Dublin' },
    { href: '/households', label: 'Households & Rent' },
  ]},
  { section: 'Reference', links: [
    { href: '/methods-sources', label: 'Methods & Sources' },
    { href: '/methods-sources#definitions', label: 'Definitions' },
    { href: '/methods-sources#caveats', label: 'Caveats' },
  ]},
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SectionNav />

        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
          {children}
        </main>

        <footer style={{
          background: '#1A1916',
          marginTop: 0,
        }}>
          {/* Footer top — links */}
          <div style={{
            maxWidth: 1100, margin: '0 auto',
            padding: '48px 24px 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '32px 40px',
          }}>
            {/* Brand column */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 17, color: '#F5F4F0',
                marginBottom: 10,
              }}>
                Irish Data Platform
              </div>
              <p style={{
                fontSize: 12, color: '#6B6860', lineHeight: 1.65,
                maxWidth: 220,
              }}>
                Making Irish public finance and regional economics understandable for citizens.
              </p>
              <p style={{ fontSize: 11, color: '#4A4740', marginTop: 16 }}>
                Data: CSO · Eurostat · IFAC · RTB
              </p>
            </div>

            {/* Nav columns */}
            {FOOTER_LINKS.map(({ section, links }) => (
              <div key={section}>
                <div style={{
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#4A4740', marginBottom: 12,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {section}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} style={{
                        fontSize: 13, color: '#A8A69F',
                        textDecoration: 'none',
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'color 0.15s',
                      }}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer bottom */}
          <div style={{
            maxWidth: 1100, margin: '0 auto',
            padding: '16px 24px 32px',
            borderTop: '1px solid #2A2926',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
          }}>
            <p style={{ fontSize: 11, color: '#4A4740', fontFamily: "'DM Sans', sans-serif" }}>
              Irish Data Platform — independent analysis, April 2026
            </p>
            <p style={{ fontSize: 11, color: '#4A4740', fontFamily: "'DM Sans', sans-serif" }}>
              Not affiliated with CSO, Eurostat, or any government department. All figures sourced from official publications.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
