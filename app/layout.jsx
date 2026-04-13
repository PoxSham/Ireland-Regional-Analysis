import './globals.css';
import SectionNav from './components/ui/SectionNav';

export const metadata = {
  title: { template: '%s | Irish Regional Economics', default: 'Irish Regional Economics — 2024 Analysis' },
  description: 'A data-led analysis of Ireland\'s regional economy in 2024. GVA, household income, fiscal policy, population, and European context. Based on CSO 2024 and Eurostat data.',
  keywords: 'Ireland, regional economics, GVA, CSO, GNI*, NUTS3, Eurostat, PPS',
  openGraph: {
    title: 'Irish Regional Economics — 2024 Analysis',
    description: 'GVA per person, household income, fiscal analysis, and European comparison across Irish NUTS3 regions.',
    type: 'website',
    siteName: 'Irish Regional Economics',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F5F4F0',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ background: '#F5F4F0', margin: 0 }}>
        <SectionNav />
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
          {children}
        </main>
        <footer style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 48px', borderTop: '1px solid #E2DFD8' }}>
          <p style={{ fontSize: 12, color: '#A8A69F', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            Irish Regional Economics — 2024 Analysis. Data from CSO, Eurostat, IFAC, RTB, Wind Energy Ireland. 
            Last updated: 13 April 2026. Built with Next.js and Recharts.
          </p>
        </footer>
      </body>
    </html>
  );
}
