import React from 'react';
import { ShoppingCart, Car, DollarSign, Package } from 'lucide-react';

/**
 * Vehicle card component for displaying individual vehicle details.
 * Shows purchase button that's disabled when quantity is zero.
 */
export default function VehicleCard({ vehicle, onPurchase }) {
  const isOutOfStock = vehicle.quantity === 0;

  // Format price with commas and dollar sign
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);

  // Category badge colors
  const categoryColors = {
    sedan: 'bg-blue-100 text-blue-700',
    suv: 'bg-green-100 text-green-700',
    truck: 'bg-amber-100 text-amber-700',
    coupe: 'bg-purple-100 text-purple-700',
    hatchback: 'bg-teal-100 text-teal-700',
    convertible: 'bg-rose-100 text-rose-700',
    van: 'bg-indigo-100 text-indigo-700',
    wagon: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="card group">
      {/* Vehicle Image */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement.querySelector('.fallback-icon')?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`fallback-icon ${vehicle.imageUrl ? 'hidden' : 'flex'} w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 items-center justify-center`}>
          <Car className="h-20 w-20 text-primary-300 group-hover:text-primary-400 transition-colors" />
        </div>
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
              categoryColors[vehicle.category] || 'bg-gray-100 text-gray-700'
            }`}
          >
            {vehicle.category}
          </span>
        </div>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-white font-bold text-sm tracking-wider uppercase bg-red-600 px-3 py-1 rounded shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Vehicle Details */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {vehicle.description}
            </p>
          )}
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-2xl font-bold text-primary-600">
            <DollarSign className="h-5 w-5" />
            <span>{formatPrice(vehicle.price).replace('$', '')}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Package className="h-4 w-4" />
            <span>
              {vehicle.quantity} {vehicle.quantity === 1 ? 'unit' : 'units'} left
            </span>
          </div>
        </div>

        {/* Purchase Button */}
        <button
          onClick={() => onPurchase(vehicle._id)}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{isOutOfStock ? 'Out of Stock' : 'Purchase'}</span>
        </button>
      </div>
    </div>
  );
}
