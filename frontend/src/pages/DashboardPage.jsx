import React, { useState, useEffect, useCallback } from 'react';
import { vehicleAPI } from '../services/api';
import VehicleCard from '../components/VehicleCard';
import SearchBar from '../components/SearchBar';
import toast from 'react-hot-toast';
import { Car, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

/**
 * Main dashboard page displaying the vehicle inventory.
 * Supports search, filtering, pagination, and purchasing.
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
      // Refresh the current view
      if (isSearchMode) {
        // Re-fetch current page for now
        fetchVehicles(currentPage);
      } else {
        fetchVehicles(currentPage);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Purchase failed';
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchVehicles(1);
  }, [fetchVehicles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Inventory</h1>
        <p className="text-gray-500 mt-1">
          Browse our collection of premium vehicles
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} onReset={handleReset} />

      {/* Results Info */}
      {!loading && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {isSearchMode
              ? `Found ${vehicles.length} vehicle(s)`
              : `Showing ${vehicles.length} of ${pagination?.totalItems || 0} vehicles`}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : vehicles.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
          <p className="text-gray-500 mt-1">
            {isSearchMode
              ? 'Try adjusting your search filters'
              : 'No vehicles available at the moment'}
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
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button
            onClick={() => fetchVehicles(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-secondary flex items-center space-x-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          <span className="text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchVehicles(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="btn-secondary flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
