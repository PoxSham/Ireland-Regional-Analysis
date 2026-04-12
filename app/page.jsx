'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, MapPin, AlertCircle, Info, Search, Filter, X } from 'lucide-react';
import { irishRegions, europeanCountries, euAverages, irelandNational } from './data';
import RegionalChart from './components/RegionalChart';
import EuropeanComparison from './components/EuropeanComparison';
import TrendChart from './components/TrendChart';
import MetricCard from './components/MetricCard';
import SearchFilter from './components/SearchFilter';

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState('dublin');
  const [showMetric, setShowMetric] = useState('gva');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInfra, setFilterInfra] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const selected = irishRegions.find(r => r.id === selectedRegion);

  // Filter regions based on search and infrastructure score
  const filteredRegions = useMemo(() => {
    return irishRegions.filter(region => {
      const matchesSearch = region.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesInfra = filterInfra === 'all' ||
        (filterInfra === 'developed' && region.infraScore >= 60) ||
        (filterInfra === 'moderate' && region.infraScore >= 40 && region.infraScore < 60) ||
        (filterInfra === 'underdeveloped' && region.infraScore < 40);
      return matchesSearch && matchesInfra;
    });
  }, [searchQuery, filterInfra]);

  const nationalGVA = irelandNational.gvaPerCapita;
  const selectedGVADiff = ((selected.gva[2024] - nationalGVA) / nationalGVA * 100).toFixed(1);
  const selectedInfraDiff = (selected.infraScore - 65).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-emerald-500" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  Irish Regional Economics Dashboard
                </h1>
                <p className="text-slate-400 text-sm">2024 Analysis with European Comparisons</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-700 bg-slate-800/50 sticky top-20 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {['overview', 'europe', 'trends', 'insights'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 transition-all capitalize ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Search & Filter */}
        <SearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterInfra={filterInfra}
          setFilterInfra={setFilterInfra}
        />

        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                label="National GVA/Capita"
                value={`€${(nationalGVA).toLocaleString()}`}
                change="+2.8%"
                trend="up"
                color="emerald"
              />
              <MetricCard
                label="EU Average"
                value={`€${euAverages.gvaPerCapita.toLocaleString()}`}
                change={`+${((nationalGVA / euAverages.gvaPerCapita - 1) * 100).toFixed(1)}%`}
                trend="up"
                color="blue"
              />
              <MetricCard
                label="Unemployment"
                value="4.5%"
                change="-0.2%"
                trend="down"
                color="green"
              />
              <MetricCard
                label="Regions Analyzed"
                value={irishRegions.length}
                change="Complete"
                trend="stable"
                color="purple"
              />
            </div>

            {/* Regional Comparison Chart */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Regional GVA Per Capita Comparison
              </h2>
              <RegionalChart regions={irishRegions} metric={showMetric} />
              <div className="mt-6 flex gap-4">
                {['gva', 'disposable', 'unemployment'].map(metric => (
                  <button
                    key={metric}
                    onClick={() => setShowMetric(metric)}
                    className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                      showMetric === metric
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {metric === 'gva' ? 'GVA/Capita' : metric === 'disposable' ? 'Disposable Income' : 'Unemployment %'}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Selection Grid */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-6">Select Region for Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {filteredRegions.map(region => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedRegion === region.id
                        ? `border-${region.color === '#ef4444' ? 'red' : region.color === '#f97316' ? 'orange' : 'slate'}-500 bg-slate-700/50`
                        : 'border-slate-600 hover:border-slate-500 bg-slate-700/20'
                    }`}
                    style={{
                      borderColor: selectedRegion === region.id ? region.color : undefined,
                    }}
                  >
                    <div className="font-semibold text-white">{region.name}</div>
                    <div className="text-xs text-slate-400 mt-1">GVA: €{region.gva[2024].toLocaleString()}</div>
                    <div className="text-xs mt-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: region.color + '25',
                          color: region.color,
                        }}
                      >
                        {region.infraLabel}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Region Details */}
            {selected && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card */}
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/30 border border-slate-600 rounded-xl p-6 space-y-4 backdrop-blur-sm">
                  <div className="flex items-start justify-between">
                    <h3 className="text-2xl font-bold">{selected.name}</h3>
                    <div
                      className="w-12 h-12 rounded-full"
                      style={{ backgroundColor: selected.color + '20', border: `2px solid ${selected.color}` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="bg-slate-700/40 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Population</div>
                      <div className="text-lg font-bold">{selected.population}</div>
                    </div>
                    <div className="bg-slate-700/40 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">GDP Share (Ireland)</div>
                      <div className="text-lg font-bold">{selected.gdpShare}%</div>
                    </div>
                    <div className="bg-slate-700/40 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">GVA/Capita 2024</div>
                      <div className="text-lg font-bold">€{selected.gva[2024].toLocaleString()}</div>
                      <div className={`text-xs mt-1 ${selectedGVADiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {selectedGVADiff > 0 ? '+' : ''}{selectedGVADiff}% vs national
                      </div>
                    </div>
                    <div className="bg-slate-700/40 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Infrastructure Score</div>
                      <div className="text-lg font-bold">{selected.infraScore}/100</div>
                      <div className={`text-xs mt-1 ${selectedInfraDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedInfraDiff > 0 ? '+' : ''}{selectedInfraDiff} vs avg
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-600">
                    <div className="mb-3">
                      <span className="text-xs text-slate-400">Infrastructure Status</span>
                      <div className="mt-2 w-full bg-slate-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all"
                          style={{
                            width: `${selected.infraScore}%`,
                            backgroundColor: selected.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                    <p className="text-sm text-slate-300">{selected.keyConstraints}</p>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                    <p className="text-xs text-slate-300">{selected.description}</p>
                  </div>
                </div>

                {/* Right Card - Trend */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
                  <h4 className="font-bold mb-4">GVA Trend (2020-2024)</h4>
                  <TrendChart region={selected} />
                </div>
              </div>
            )}

            {/* Regional Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-900/50">
                      <th className="px-6 py-4 text-left font-semibold">Region</th>
                      <th className="px-6 py-4 text-right font-semibold">GVA/Capita</th>
                      <th className="px-6 py-4 text-right font-semibold">Disposable</th>
                      <th className="px-6 py-4 text-right font-semibold">Unemployment</th>
                      <th className="px-6 py-4 text-center font-semibold">Infra Score</th>
                      <th className="px-6 py-4 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegions.map((region, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors cursor-pointer"
                        onClick={() => setSelectedRegion(region.id)}
                      >
                        <td className="px-6 py-4 font-semibold">{region.name}</td>
                        <td className="px-6 py-4 text-right">€{region.gva[2024].toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">€{region.disposable[2024].toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">{region.unemployment[2024]}%</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-20 bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${region.infraScore}%`,
                                  backgroundColor: region.color,
                                }}
                              />
                            </div>
                            <span className="text-xs font-semibold">{region.infraScore}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: region.color + '25',
                              color: region.color,
                            }}
                          >
                            {region.infraLabel}
                          </span>
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
          <EuropeanComparison countries={europeanCountries} averages={euAverages} />
        )}

        {activeTab === 'trends' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">Historical Trends & Projections</h2>
            <TrendChart region={selected} extended={true} />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex gap-3 mb-4">
                <Info className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-3">Key Insights</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Dublin represents 41% of national GDP but only 23% of population - significant concentration</li>
                    <li>• National GVA/capita (€89,800) is 111% above EU average (€42,500)</li>
                    <li>• Regional disparity: Dublin's GVA 5.6x higher than North-West</li>
                    <li>• Infrastructure constraints limit growth in high-demand regions (Dublin, Mid-East)</li>
                    <li>• Western & Midland regions face both economic and infrastructure challenges</li>
                    <li>• Unemployment lowest in Dublin (3.7%), highest in Midlands (7.7%)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg mb-3">Policy Implications</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Balanced regional development requires targeted infrastructure investment in lagging regions</li>
                    <li>• Housing and transport capacity critical constraints in Dublin metropolitan area</li>
                    <li>• Grid modernization essential for manufacturing expansion outside Dublin</li>
                    <li>• Water infrastructure critical for Mid-East and South-West growth</li>
                    <li>• Broadband deployment impacts competitiveness of rural regions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 backdrop-blur-sm mt-12">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-200 mb-2">Data Sources & Methodology</h3>
              <div className="text-xs text-slate-400 space-y-1">
                <p><strong>Irish Regional Data:</strong> Central Statistics Office (CSO) County Incomes & Regional GDP 2024</p>
                <p><strong>European Data:</strong> Eurostat, IMF World Economic Outlook, OECD Regional Development</p>
                <p><strong>Infrastructure Score:</strong> Composite metric: grid capacity, transport networks, water supply, broadband, housing</p>
                <p><strong>Note:</strong> National GDP figures are inflated by foreign-owned multinational activity; regional comparisons focus on GVA</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
