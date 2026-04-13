'use client';

import { useState, useMemo, lazy, Suspense } from 'react';
import { MapPin, Info, Search, Filter, X, TrendingUp, Wind, Users, Globe, Home, Building2, BarChart3, ChevronDown } from 'lucide-react';
import { irishRegions, europeanCountries, euAverages, irelandNational, countyData } from './data';
import ScatterPlot from './components/ScatterPlot';
import TrendChart from './components/TrendChart';
import MetricCard from './components/MetricCard';
import SearchFilter from './components/SearchFilter';

// Lazy-load heavy tabs
const RenewableEnergy = lazy(() => import('./components/RenewableEnergy'));
const FDIAnalysis = lazy(() => import('./components/FDIAnalysis'));
const PopulationProjections = lazy(() => import('./components/PopulationProjections'));
const CostOfLiving = lazy(() => import('./components/CostOfLiving'));
const SectoralComposition = lazy(() => import('./components/SectoralComposition'));
const InfrastructureBreakdown = lazy(() => import('./components/InfrastructureBreakdown'));
const EuropeanComparison = lazy(() => import('./components/EuropeanComparison'));
const RegionalChart = lazy(() => import('./components/RegionalChart'));

const TABS = [
  { id: 'overview',    label: 'Overview',       icon: TrendingUp },
  { id: 'europe',      label: 'Europe',         icon: Globe },
  { id: 'energy',      label: 'Renewable Energy', icon: Wind },
  { id: 'population',  label: 'Population',     icon: Users },
  { id: 'fdi',         label: 'FDI',            icon: Building2 },
  { id: 'cost',        label: 'Cost of Living', icon: Home },
  { id: 'sectors',     label: 'Sectors',        icon: BarChart3 },
  { id: 'infra',       label: 'Infrastructure', icon: Building2 },
];

function TabLoader() {
  return <div className="flex items-center justify-center h-48 text-irish-muted text-sm">Loading analysis...</div>;
}

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState('dublin');
  const [showMetric, setShowMetric] = useState('gva');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInfra, setFilterInfra] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('region'); // 'region' | 'county'
  const [showInsights, setShowInsights] = useState(false);

  const selected = irishRegions.find(r => r.id === selectedRegion);
  const scatterData = viewMode === 'county' ? countyData.map(c => ({ ...c, gva: { 2024: c.gva }, infraScore: c.infraScore, shortName: c.name, id: c.name.toLowerCase(), unemployment: { 2024: 6 } })) : irishRegions;

  const filteredRegions = useMemo(() => irishRegions.filter(region => {
    const matchesSearch = region.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInfra =
      filterInfra === 'all' ||
      (filterInfra === 'developed' && region.infraScore >= 60) ||
      (filterInfra === 'moderate' && region.infraScore >= 40 && region.infraScore < 60) ||
      (filterInfra === 'underdeveloped' && region.infraScore < 40);
    return matchesSearch && matchesInfra;
  }), [searchQuery, filterInfra]);

  const gvaDiff = ((selected.gva[2024] - irelandNational.gvaPerCapita) / irelandNational.gvaPerCapita * 100).toFixed(1);
  const infraDiff = (selected.infraScore - 65).toFixed(0);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a1f0f 0%, #0d2b18 40%, #0f1f2e 100%)' }}>

      {/* Header */}
      <header className="border-b border-irish-border sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'rgba(10,31,15,0.9)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #169B62, #FF7900)' }}>
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight" style={{ background: 'linear-gradient(90deg, #169B62, #ffffff, #FF7900)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Irish Regional Economics
                </h1>
                <p className="text-xs text-slate-400">2024 Analysis · EU Benchmarks · Policy Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode(m => m === 'region' ? 'county' : 'region')}
                className="px-3 py-1.5 text-xs rounded-lg border transition-all font-semibold"
                style={{ borderColor: '#169B62', color: viewMode === 'county' ? '#0a1f0f' : '#169B62', backgroundColor: viewMode === 'county' ? '#169B62' : 'transparent' }}
              >
                {viewMode === 'region' ? 'View by County' : 'View by Region'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-irish-border sticky top-[73px] z-40 backdrop-blur-sm overflow-x-auto" style={{ backgroundColor: 'rgba(13,43,24,0.85)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 min-w-max">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex items-center gap-1.5 py-4 px-3 border-b-2 transition-all text-sm whitespace-nowrap"
                style={{
                  borderColor: activeTab === id ? '#169B62' : 'transparent',
                  color: activeTab === id ? '#4ade80' : '#94a3b8',
                  fontWeight: activeTab === id ? 700 : 400,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── HERO: Scatter Plot (always visible) ── */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.6)', backdropFilter: 'blur(12px)' }}>
          <div className="px-6 pt-6 pb-2 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Wealth vs Infrastructure: Ireland &amp; Europe</h2>
              <p className="text-xs text-slate-400 mt-1">Click an Irish region to explore. Ireland sits in the <span className="text-orange-400 font-semibold">"Rich but Under-Built"</span> quadrant relative to EU peers.</p>
            </div>
            <span className="text-xs text-slate-500 bg-slate-800/60 px-3 py-1 rounded-full">CSO 2024 · IMF · WEF GCI</span>
          </div>
          <div className="px-6 pb-6">
            <ScatterPlot
              regions={viewMode === 'county' ? countyData.map(c => ({ ...c, gva: { 2024: c.gva }, unemployment: { 2024: 6 }, shortName: c.name, id: c.name.toLowerCase(), infraLabel: '' })) : irishRegions}
              euCountries={europeanCountries}
              onSelectRegion={setSelectedRegion}
              selectedId={selectedRegion}
              viewMode={viewMode}
            />
          </div>
        </div>

        {/* ── TABS ── */}
        {activeTab === 'overview' && (
          <>
            <SearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterInfra={filterInfra} setFilterInfra={setFilterInfra} />

            {/* National KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="National GVA/Capita" value={`€${irelandNational.gvaPerCapita.toLocaleString()}`} change="+2.8% YoY" trend="up" color="green" />
              <MetricCard label="vs EU Average" value={`+${((irelandNational.gvaPerCapita / euAverages.gvaPerCapita - 1) * 100).toFixed(0)}%`} change="€42,500 EU avg" trend="up" color="blue" />
              <MetricCard label="Unemployment" value="4.5%" change="-0.2% YoY" trend="down" color="green" />
              <MetricCard label="Regional Disparity" value="5.6×" change="Dublin vs NW" trend="stable" color="orange" />
            </div>

            {/* Bar chart */}
            <div className="rounded-2xl border p-6" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-irish-green" />
                Regional Comparison
              </h2>
              <Suspense fallback={<TabLoader />}>
                <RegionalChart regions={filteredRegions} metric={showMetric} />
              </Suspense>
              <div className="mt-4 flex gap-3">
                {[['gva','GVA/Capita'],['disposable','Disposable Income'],['unemployment','Unemployment %']].map(([k,l]) => (
                  <button key={k} onClick={() => setShowMetric(k)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: showMetric === k ? '#169B62' : 'rgba(30,50,38,0.8)', color: showMetric === k ? '#fff' : '#94a3b8', border: `1px solid ${showMetric === k ? '#169B62' : '#1a3a28'}` }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Region selector grid */}
            <div className="rounded-2xl border p-6" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
              <h2 className="text-lg font-bold mb-4">Select Region</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {filteredRegions.map(r => (
                  <button key={r.id} onClick={() => setSelectedRegion(r.id)}
                    className="p-4 rounded-xl border-2 text-left transition-all"
                    style={{ borderColor: selectedRegion === r.id ? r.color : '#1a3a28', backgroundColor: selectedRegion === r.id ? r.color + '15' : 'rgba(13,43,24,0.4)' }}>
                    <div className="font-semibold text-sm text-white">{r.shortName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">€{r.gva[2024].toLocaleString()}</div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: r.color + '25', color: r.color }}>{r.infraLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Region detail + trend */}
            {selected && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border p-6 space-y-4" style={{ borderColor: selected.color + '40', background: 'rgba(13,43,24,0.6)' }}>
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold">{selected.name}</h3>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: selected.color + '20', border: `2px solid ${selected.color}` }}>
                      <span className="text-xs font-bold" style={{ color: selected.color }}>{selected.shortName[0]}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Population', value: selected.populationLabel },
                      { label: 'GDP Share', value: `${selected.gdpShare}%` },
                      { label: 'GVA/Capita 2024', value: `€${selected.gva[2024].toLocaleString()}`, sub: `${gvaDiff > 0 ? '+' : ''}${gvaDiff}% vs national`, subColor: gvaDiff > 0 ? '#4ade80' : '#f87171' },
                      { label: 'Infrastructure', value: `${selected.infraScore}/100`, sub: `${infraDiff > 0 ? '+' : ''}${infraDiff} vs avg`, subColor: infraDiff > 0 ? '#4ade80' : '#f87171' },
                    ].map(m => (
                      <div key={m.label} className="rounded-lg p-3" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                        <div className="text-xs text-slate-400 mb-1">{m.label}</div>
                        <div className="font-bold text-white">{m.value}</div>
                        {m.sub && <div className="text-xs mt-0.5" style={{ color: m.subColor }}>{m.sub}</div>}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Infrastructure Score</div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${selected.infraScore}%`, backgroundColor: selected.color }} />
                    </div>
                  </div>
                  <div className="rounded-lg p-3 text-sm text-slate-300 border border-slate-700/50 italic">"{selected.description}"</div>
                  <div className="text-xs text-slate-400 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-400" />
                    {selected.keyConstraints}
                  </div>
                </div>
                <div className="rounded-2xl border p-6" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
                  <h4 className="font-bold mb-4">GVA &amp; Income Trend (2020–2024)</h4>
                  <TrendChart region={selected} />
                </div>
              </div>
            )}

            {/* Full table */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#1a3a28', backgroundColor: 'rgba(10,31,15,0.7)' }}>
                      {['Region','GVA/Capita','Disposable','Unemployment','FDI Share','Infra Score','Status'].map(h => (
                        <th key={h} className="px-5 py-4 text-left font-semibold text-slate-300">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegions.map((r, i) => (
                      <tr key={i} className="border-b border-slate-700/30 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedRegion(r.id)}>
                        <td className="px-5 py-4 font-semibold">{r.name}</td>
                        <td className="px-5 py-4">€{r.gva[2024].toLocaleString()}</td>
                        <td className="px-5 py-4">€{r.disposable[2024].toLocaleString()}</td>
                        <td className="px-5 py-4">{r.unemployment[2024]}%</td>
                        <td className="px-5 py-4">{r.fdiShare}%</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-700 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full" style={{ width: `${r.infraScore}%`, backgroundColor: r.color }} />
                            </div>
                            <span className="font-bold text-xs">{r.infraScore}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: r.color + '20', color: r.color }}>{r.infraLabel}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'europe' && (
          <Suspense fallback={<TabLoader />}>
            <EuropeanComparison countries={europeanCountries} averages={euAverages} />
          </Suspense>
        )}

        {activeTab === 'energy' && (
          <Suspense fallback={<TabLoader />}>
            <RenewableEnergy />
          </Suspense>
        )}

        {activeTab === 'population' && (
          <Suspense fallback={<TabLoader />}>
            <PopulationProjections />
          </Suspense>
        )}

        {activeTab === 'fdi' && (
          <Suspense fallback={<TabLoader />}>
            <FDIAnalysis />
          </Suspense>
        )}

        {activeTab === 'cost' && (
          <Suspense fallback={<TabLoader />}>
            <CostOfLiving />
          </Suspense>
        )}

        {activeTab === 'sectors' && (
          <Suspense fallback={<TabLoader />}>
            <SectoralComposition />
          </Suspense>
        )}

        {activeTab === 'infra' && (
          <Suspense fallback={<TabLoader />}>
            <InfrastructureBreakdown selectedId={selectedRegion} />
          </Suspense>
        )}

        {/* Collapsible Key Insights */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#1a3a28', background: 'rgba(13,43,24,0.5)' }}>
          <button className="w-full px-6 py-4 flex items-center justify-between text-left" onClick={() => setShowInsights(v => !v)}>
            <div className="flex items-center gap-2 font-bold"><Info className="w-4 h-4 text-irish-green" />Key Insights & Policy Implications</div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showInsights ? 'rotate-180' : ''}`} />
          </button>
          {showInsights && (
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-700/30">
              <div>
                <h4 className="font-semibold text-irish-green mb-3 mt-4">Economic Insights</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Dublin (41% GDP, 23% population) creates severe agglomeration effects</li>
                  <li>• National GVA/capita €89,800 is 111% above EU average — inflated by MNCs</li>
                  <li>• North-West GVA 5.6× lower than Dublin; growing divergence since 2015</li>
                  <li>• 71% of FDI locked in Eastern & Midland region; West gets 4%</li>
                  <li>• After rent, Dublin's purchasing power advantage nearly disappears</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-3 mt-4">Policy Priorities</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Grid investment in West/NW is critical for 2030 renewable targets</li>
                  <li>• Water and housing infrastructure must precede regional FDI attraction</li>
                  <li>• NDP allocations underserve lagging regions relative to population share</li>
                  <li>• Brain drain from Midlands/NW creating vicious cycle of decline</li>
                  <li>• IDA regionalization policy needs teeth — value not just investment counts</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 pb-8 space-y-1 border-t border-slate-800 pt-6">
          <p className="font-semibold text-slate-400">Data Sources</p>
          <p>CSO County Incomes & Regional GDP 2024 · CSO Housing Statistics 2024 · EPA Urban Wastewater Report 2023 · EirGrid Transmission Capacity Reports · Wind Energy Ireland 2024 · Comreg/National Broadband Plan · RTB Rent Index Q2 2024 · Daft.ie 2025 · CSO Population Projections Jan 2025 · CSO FDI Statistics 2023 · National Development Plan 2021–2030 · Budget 2025 · Eurostat Regional Statistics 2024 · IMF World Economic Outlook 2024 · WEF Global Competitiveness Index 2023-24</p>
        </div>
      </main>
    </div>
  );
}
