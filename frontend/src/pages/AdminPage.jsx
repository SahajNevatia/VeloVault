import React, { useState, useEffect } from 'react';
import { vehicleAPI } from '../services/api';
import VehicleForm from '../components/VehicleForm';
import toast from 'react-hot-toast';
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Car,
  Loader2,
  AlertTriangle,
  Shield,
} from 'lucide-react';

/**
 * Admin inventory control panel with Light Mode (White/Blue) & Dark Mode (Black/Purple).
 */
export default function AdminPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [restockId, setRestockId] = useState(null);
  const [restockQty, setRestockQty] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch all vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleAPI.getAll(1, 100);
      setVehicles(response.data.data.vehicles);
    } catch (error) {
      toast.error('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Create or update vehicle
  const handleSubmit = async (data) => {
    try {
      if (editingVehicle) {
        await vehicleAPI.update(editingVehicle._id, data);
        toast.success('Vehicle updated successfully');
      } else {
        await vehicleAPI.create(data);
        toast.success('Vehicle added successfully');
      }
      setShowForm(false);
      setEditingVehicle(null);
      fetchVehicles();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    }
  };

  // Delete vehicle
  const handleDelete = async (id) => {
    try {
      await vehicleAPI.delete(id);
      toast.success('Vehicle deleted successfully');
      setDeleteConfirm(null);
      fetchVehicles();
    } catch (error) {
      const message = error.response?.data?.message || 'Delete failed';
      toast.error(message);
    }
  };

  // Restock vehicle
  const handleRestock = async (id) => {
    const qty = parseInt(restockQty);
    if (!qty || qty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    try {
      await vehicleAPI.restock(id, qty);
      toast.success('Vehicle restocked successfully');
      setRestockId(null);
      setRestockQty('');
      fetchVehicles();
    } catch (error) {
      const message = error.response?.data?.message || 'Restock failed';
      toast.error(message);
    }
  };

  // Format price
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0a0a12] dark:text-slate-100 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 dark:bg-purple-950/60 dark:border-purple-800/60 dark:text-purple-300 text-xs font-semibold mb-3">
              <Shield className="h-3.5 w-3.5 text-primary-600 dark:text-purple-400" />
              <span>Fleet Administration Control</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-purple-200 dark:to-purple-400">
              Inventory Management Portal
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm">
              Add new vehicles, update prices, manage stock quotas, and modify catalog listings
            </p>
          </div>
          <button
            onClick={() => {
              setEditingVehicle(null);
              setShowForm(true);
            }}
            className="btn-primary inline-flex items-center space-x-2 self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Vehicle</span>
          </button>
        </div>

        {/* Vehicle Form Modal */}
        {showForm && (
          <VehicleForm
            vehicle={editingVehicle}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingVehicle(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#141424] border border-gray-200 dark:border-red-500/40 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg border border-red-200 dark:border-red-500/40">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Removal</h3>
              </div>
              <p className="text-gray-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                Are you sure you want to delete this vehicle from the dealership inventory? This record will be permanently deleted from MongoDB Atlas.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="btn-danger flex-1"
                >
                  Delete Record
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600 dark:text-purple-500" />
            <span className="text-gray-500 dark:text-slate-400 text-sm font-medium">Loading inventory records...</span>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-24 bg-white border border-gray-200 dark:bg-[#121222] dark:border-purple-900/30 rounded-2xl shadow-sm">
            <Car className="h-16 w-16 text-gray-300 dark:text-purple-700/60 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No vehicles in inventory</h3>
            <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm max-w-sm mx-auto">
              Click "Add New Vehicle" to register your first dealership unit
            </p>
          </div>
        ) : (
          /* Vehicle Table */
          <div className="bg-white dark:bg-[#131324] rounded-xl shadow-sm dark:shadow-2xl dark:shadow-black/60 border border-gray-200 dark:border-purple-900/40 overflow-hidden transition-colors duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-[#18182e] border-b border-gray-200 dark:border-purple-900/40">
                  <tr>
                    <th className="py-4 px-6 text-xs font-bold text-gray-600 dark:text-purple-300 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-600 dark:text-purple-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-600 dark:text-purple-300 uppercase tracking-wider">
                      Listing Price
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-600 dark:text-purple-300 uppercase tracking-wider">
                      Stock Level
                    </th>
                    <th className="py-4 px-6 text-right text-xs font-bold text-gray-600 dark:text-purple-300 uppercase tracking-wider">
                      Management Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-purple-950/60">
                  {vehicles.map((vehicle) => (
                    <tr
                      key={vehicle._id}
                      className="hover:bg-gray-50 dark:hover:bg-purple-950/20 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3.5">
                          {vehicle.imageUrl ? (
                            <img
                              src={vehicle.imageUrl}
                              alt={vehicle.model}
                              className="h-12 w-16 rounded-lg object-cover border border-gray-200 dark:border-purple-900/40 bg-gray-100 dark:bg-slate-900"
                            />
                          ) : (
                            <div className="h-12 w-16 rounded-lg bg-primary-50 dark:bg-purple-950/60 border border-primary-200 dark:border-purple-800/40 flex items-center justify-center">
                              <Car className="h-6 w-6 text-primary-600 dark:text-purple-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-purple-300 transition-colors">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-1 max-w-xs">
                              {vehicle.description || 'No description provided'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-purple-950/80 text-gray-700 dark:text-purple-300 border border-gray-200 dark:border-purple-700/60 uppercase tracking-wider">
                          {vehicle.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-primary-600 dark:text-purple-400 text-base">
                        {formatPrice(vehicle.price)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`font-semibold text-sm ${
                              vehicle.quantity === 0
                                ? 'text-red-500 dark:text-red-400'
                                : vehicle.quantity < 3
                                ? 'text-amber-500 dark:text-amber-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {vehicle.quantity} units
                          </span>
                          {restockId === vehicle._id ? (
                            <div className="flex items-center space-x-1.5 bg-gray-100 dark:bg-[#18182e] p-1 rounded-lg border border-gray-300 dark:border-purple-700/50">
                              <input
                                type="number"
                                min="1"
                                value={restockQty}
                                onChange={(e) => setRestockQty(e.target.value)}
                                placeholder="Qty"
                                className="w-16 px-2 py-1 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-purple-900/60 rounded text-xs focus:outline-none focus:border-primary-500 dark:focus:border-purple-500"
                              />
                              <button
                                onClick={() => handleRestock(vehicle._id)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => {
                                  setRestockId(null);
                                  setRestockQty('');
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-white px-1 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setRestockId(vehicle._id)}
                              className="p-1.5 text-primary-600 hover:bg-primary-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-950/60 rounded-lg transition-colors border border-gray-200 dark:border-purple-900/40"
                              title="Restock units"
                            >
                              <Package className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Edit */}
                          <button
                            onClick={() => {
                              setEditingVehicle(vehicle);
                              setShowForm(true);
                            }}
                            className="p-2 text-primary-600 hover:bg-primary-50 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-950/60 rounded-lg transition-colors border border-gray-200 dark:border-purple-900/40"
                            title="Edit Vehicle"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirm(vehicle._id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500/20 rounded-lg transition-colors border border-red-200 dark:border-red-900/40"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
