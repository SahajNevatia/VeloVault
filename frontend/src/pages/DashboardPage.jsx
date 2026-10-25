import React, { useState, useEffect, useCallback } from 'react';
import { vehicleAPI } from '../services/api';
import VehicleCard from '../components/VehicleCard';
import SearchBar from '../components/SearchBar';
import toast from 'react-hot-toast';
import { Car, ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';

/**
 * Main dashboard page displaying vehicle inventory.
 * Supports Light Mode (White/Blue) & Dark Mode (Obsidian Black/Neon Purple).
 */
export default function DashboardPage() {
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all vehicles with pagination
  const fetchVehicles = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await vehicleAPI.getAll(page, 12);
      setVehicles(response.data.data.vehicles);
      setPagination(response.data.data.pagination);
      setCurrentPage(page);
      setIsSearchMode(false);
    } catch (error) {
      toast.error('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search vehicles with filters
  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      const response = await vehicleAPI.search(filters);
      setVehicles(response.data.data);
      setPagination(null); // No pagination for search results
      setIsSearchMode(true);
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset to default view
  const handleReset = () => {
    fetchVehicles(1);
  };

  // Handle vehicle purchase
  const handlePurchase = async (vehicleId) => {
    try {
      await vehicleAPI.purchase(vehicleId);
      toast.success('Vehicle purchased successfully!');
      fetchVehicles(currentPage);
    } catch (error) {
      const message = error.response?.data?.message || 'Purchase failed';
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchVehicles(1);
  }, [fetchVehicles]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0a0a12] dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 dark:bg-purple-950/60 dark:border-purple-800/60 dark:text-purple-300 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5 text-primary-600 dark:text-purple-400" />
              <span>Certified Dealership Fleet</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-purple-200 dark:to-purple-400">
              Vehicle Inventory
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1.5 text-sm">
              Explore our verified collection of sports, luxury, and electric performance vehicles
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} onReset={handleReset} />

        {/* Results Info */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">
              {isSearchMode
                ? `Found ${vehicles.length} matching vehicle(s)`
                : `Showing ${vehicles.length} of ${pagination?.totalItems || 0} available vehicles`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600 dark:text-purple-500" />
            <span className="text-gray-500 dark:text-slate-400 text-sm font-medium">Loading inventory...</span>
          </div>
        ) : vehicles.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 bg-white border border-gray-200 dark:bg-[#121222] dark:border-purple-900/30 rounded-2xl shadow-sm">
            <Car className="h-16 w-16 text-gray-300 dark:text-purple-700/60 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No vehicles found</h3>
            <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm max-w-sm mx-auto">
              {isSearchMode
                ? 'Try adjusting your search criteria or resetting the filters'
                : 'No vehicles are currently listed in the inventory'}
            </p>
          </div>
        ) : (
          /* Vehicle Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && !isSearchMode && (
          <div className="flex items-center justify-center space-x-4 mt-12 pt-6 border-t border-gray-200 dark:border-purple-950/60">
            <button
              onClick={() => fetchVehicles(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <span className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-3">
              Page <span className="text-primary-600 dark:text-purple-400 font-bold">{pagination.currentPage}</span> of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchVehicles(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="btn-secondary flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
