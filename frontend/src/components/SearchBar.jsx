import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

/**
 * Search and filter bar supporting Light Mode (White/Blue) & Dark Mode (Black/Purple).
 */
export default function SearchBar({ onSearch, onReset }) {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    'sedan', 'suv', 'truck', 'coupe',
    'hatchback', 'convertible', 'van', 'wagon',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const activeFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '') activeFilters[key] = value;
    });
    onSearch(activeFilters);
  };

  const handleReset = () => {
    setFilters({ make: '', model: '', category: '', minPrice: '', maxPrice: '' });
    onReset();
  };

  return (
    <div className="bg-white dark:bg-[#131324] rounded-xl shadow-sm dark:shadow-xl dark:shadow-black/40 border border-gray-200 dark:border-purple-900/40 p-4 mb-8 transition-colors duration-200">
      <form onSubmit={handleSearch}>
        {/* Main Search Bar */}
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-purple-400" />
            <input
              type="text"
              name="make"
              placeholder="Search by make (e.g., Porsche, Tesla, BMW, Ford)..."
              value={filters.make}
              onChange={handleChange}
              className="input-field pl-11"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`btn-secondary flex items-center space-x-1.5 ${
              showAdvanced ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-500/60' : ''
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>
          {Object.values(filters).some((v) => v !== '') && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 px-2 py-1 rounded transition-colors"
            >
              <X className="h-4 w-4" />
              <span className="text-sm font-medium">Clear</span>
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-purple-950/60 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Model Name
              </label>
              <input
                type="text"
                name="model"
                placeholder="e.g., 911, Model 3"
                value={filters.model}
                onChange={handleChange}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Vehicle Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="input-field text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Min Price (USD)
              </label>
              <input
                type="number"
                name="minPrice"
                placeholder="$0"
                value={filters.minPrice}
                onChange={handleChange}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Max Price (USD)
              </label>
              <input
                type="number"
                name="maxPrice"
                placeholder="$200,000"
                value={filters.maxPrice}
                onChange={handleChange}
                className="input-field text-sm"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
