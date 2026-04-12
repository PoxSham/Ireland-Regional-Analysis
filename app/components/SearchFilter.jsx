'use client';

import { Search, Filter, X } from 'lucide-react';

export default function SearchFilter({
  searchQuery,
  setSearchQuery,
  filterInfra,
  setFilterInfra,
}) {
  const hasFilters = searchQuery !== '' || filterInfra !== 'all';

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterInfra('all');
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Search */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
            Search Regions
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by region name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Filter */}
        <div className="w-full md:w-64">
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">
            Infrastructure Level
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select
              value={filterInfra}
              onChange={(e) => setFilterInfra(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="developed">Well-Built (60+)</option>
              <option value="moderate">Moderate (40-59)</option>
              <option value="underdeveloped">Under-Developed (&lt;40)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
            title="Clear all filters"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-400">Active filters:</span>
            {searchQuery && (
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-400">
                Search: "{searchQuery}"
              </span>
            )}
            {filterInfra !== 'all' && (
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-400">
                Infrastructure: {
                  filterInfra === 'developed' ? 'Well-Built' :
                  filterInfra === 'moderate' ? 'Moderate' :
                  'Under-Developed'
                }
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
