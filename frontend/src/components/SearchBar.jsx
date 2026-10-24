import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

/**
 * Search and filter bar component for the vehicle dashboard.
 * Supports filtering by make, model, category, and price range.
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
    // Remove empty filters before searching
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <form onSubmit={handleSearch}>
        {/* Main Search Bar */}
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="make"
              placeholder="Search by make (e.g., Toyota, Honda)..."
              value={filters.make}
              onChange={handleChange}
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`btn-secondary flex items-center space-x-1 ${
              showAdvanced ? 'bg-primary-50 text-primary-700' : ''
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>
          {Object.values(filters).some((v) => v !== '') && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="h-4 w-4" />
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                name="model"
                placeholder="e.g., Camry"
                value={filters.model}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="input-field"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                name="minPrice"
                placeholder="$0"
                value={filters.minPrice}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                name="maxPrice"
                placeholder="$100,000"
                value={filters.maxPrice}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
