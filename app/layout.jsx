import './globals.css';

export const metadata = {
  title: 'Irish Regional Economics Dashboard',
  description: 'Interactive analysis of Irish regional economic performance with European comparisons, historical trends, and infrastructure assessment.',
  keywords: 'Ireland, regional economics, GVA, infrastructure, European comparison, economic analysis',
  openGraph: {
    title: 'Irish Regional Economics Dashboard',
    description: 'Comprehensive economic analysis of Irish regions with European context',
    url: 'https://ireland-regional-analysis.netlify.app',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Irish Regional Economics Dashboard',
    description: 'Comprehensive economic analysis of Irish regions with European context',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a1f0f',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
