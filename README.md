# Irish Regional Economics Dashboard

A professional, interactive Next.js dashboard analyzing Irish regional economic performance with European comparisons, historical trends, and comprehensive infrastructure assessment.

## 🎯 Features

- **Regional Analysis**: Detailed economic metrics for 7 Irish regions
- **Interactive Charts**: Bar charts, line trends, and comparative visualizations using Recharts
- **European Context**: Compare Irish regions against European countries and EU averages
- **Historical Trends**: 5-year historical data (2020-2024) with trend analysis
- **Search & Filter**: Seamless search and filter by region name and infrastructure level
- **Key Metrics**: GVA per capita, disposable income, unemployment rates, infrastructure scores
- **Professional UI**: Modern, dark-themed interface with responsive design
- **High Performance**: Optimized Next.js with client-side rendering for instant interactions

## 📊 Data Included

### Irish Regions
1. Dublin
2. South-West (Cork, Kerry)
3. Mid-East (Kildare, Meath, Wicklow)
4. West (Galway, Mayo, Roscommon)
5. North-West (Donegal, Sligo, Leitrim)
6. Midlands (Longford, Laois, Offaly, Westmeath)
7. South-East (Waterford, Wexford, Carlow, Kilkenny, Tipperary)

### European Comparison
- Highest performers: Luxembourg, Netherlands, Germany
- Middle range: France, Spain, Poland
- Lower performers: Hungary, Greece, Bulgaria
- EU averages and benchmarks

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
├── app/
│   ├── layout.jsx              # Root layout
│   ├── page.jsx                # Main dashboard
│   ├── globals.css             # Global styles
│   ├── data.js                 # Regional & European data
│   └── components/
│       ├── RegionalChart.jsx   # Bar chart for regional comparison
│       ├── TrendChart.jsx      # Line chart for trends
│       ├── EuropeanComparison.jsx
│       ├── MetricCard.jsx      # Reusable metric cards
│       └── SearchFilter.jsx    # Search & filter UI
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## 🎨 Design

- **Color Scheme**: Dark slate with emerald accents
- **Typography**: System fonts for performance
- **Responsive**: Mobile-first, fully responsive design
- **Accessibility**: WCAG 2.1 AA standards

## 📈 Key Insights

- Dublin represents 41% of national GDP but only 23% of population
- National GVA/capita €89,800 is 111% above EU average
- Regional disparity: Dublin's GVA 5.6x higher than North-West
- Infrastructure constraints limit growth in high-demand regions
- Western & Midland regions face both economic and infrastructure challenges

## 🔧 Technology Stack

- **Framework**: Next.js 15+
- **React**: 18.3+
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Search**: Fuse.js (client-side)

## 📊 Data Sources

- **Irish Regional Data**: Central Statistics Office (CSO) County Incomes & Regional GDP 2024
- **European Data**: Eurostat, IMF World Economic Outlook, OECD Regional Development
- **Infrastructure Scores**: Composite metric based on grid capacity, transport, water supply, broadband, housing

## 🚀 Deployment

### Netlify (Recommended)

The project is configured for automatic deployment on Netlify:

1. Push to GitHub
2. Netlify automatically builds and deploys
3. Live URL: Check your Netlify dashboard

### Manual Build

```bash
npm run build
```

Output is in `.next/` directory.

## 📝 License

This project is open source.

## 👤 Author

Created with ❤️ for economic analysis and regional development insights.

---

**Last Updated**: 2026-04-13
**Version**: 1.0.0
