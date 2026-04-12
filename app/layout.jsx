import './globals.css';

export const metadata = {
  title: 'Irish Regional Economics Dashboard',
  description: 'Interactive analysis of Irish regional economic performance with European comparisons, historical trends, and infrastructure assessment.',
  keywords: 'Ireland, regional economics, GVA, infrastructure, European comparison, economic analysis',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Irish Regional Economics Dashboard',
    description: 'Comprehensive economic analysis of Irish regions with European context',
    url: 'https://ireland-regional-analysis.netlify.app',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
