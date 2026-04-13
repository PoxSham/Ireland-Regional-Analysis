import './globals.css';

export const metadata = {
  title: 'Irish Regional Economics — 2024 Analysis',
  description: 'Analysis of Irish regional economic performance: GVA, household income, fiscal policy, and European context. Based on CSO 2024 data.',
  keywords: 'Ireland, regional economics, GVA, CSO, GNI*, European comparison',
  openGraph: {
    title: 'Irish Regional Economics — 2024 Analysis',
    description: 'GVA per person, household income, and fiscal analysis across Irish NUTS3 regions',
    type: 'website',
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
