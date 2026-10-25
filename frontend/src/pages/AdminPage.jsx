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
} from 'lucide-react';

/**
 * Admin panel for managing vehicle inventory.
 * Provides CRUD operations and restock functionality.
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">Manage your vehicle inventory</p>
        </div>
        <button
          onClick={() => {
            setEditingVehicle(null);
            setShowForm(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn-danger flex-1"
              >
                Delete
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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : vehicles.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No vehicles in inventory</h3>
          <p className="text-gray-500 mt-1">
            Add your first vehicle to get started
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mt-4 inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      ) : (
        /* Vehicle Table */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center mr-3">
                          <Car className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {vehicle.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(vehicle.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium ${
                            vehicle.quantity === 0
                              ? 'text-red-600'
                              : vehicle.quantity <= 3
                              ? 'text-amber-600'
                              : 'text-green-600'
                          }`}
                        >
                          {vehicle.quantity} units
                        </span>
                        {restockId === vehicle._id ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              value={restockQty}
                              onChange={(e) => setRestockQty(e.target.value)}
                              placeholder="Qty"
                              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                              min="1"
                            />
                            <button
                              onClick={() => handleRestock(vehicle._id)}
                              className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => {
                                setRestockId(null);
                                setRestockQty('');
                              }}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRestockId(vehicle._id)}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            <Package className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingVehicle(vehicle);
                            setShowForm(true);
                          }}
                          className="text-primary-600 hover:text-primary-700 p-1"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(vehicle._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete"
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
  );
}
