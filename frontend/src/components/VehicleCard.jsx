import React from 'react';
import { ShoppingCart, Car, DollarSign, Package } from 'lucide-react';

/**
 * Vehicle card component with seamless Light Mode (Clean White/Blue) and Dark Mode (Black/Purple).
 */
export default function VehicleCard({ vehicle, onPurchase }) {
  const isOutOfStock = vehicle.quantity === 0;

  // Format price
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);

  // Category badge colors tailored for both modes
  const categoryColors = {
    sedan: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800/60',
    suv: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/60',
    truck: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/60',
    coupe: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-700/60',
    hatchback: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800/60',
    convertible: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800/60',
    van: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800/60',
    wagon: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-800/60',
  };

  return (
    <div className="card group bg-white border border-gray-100 shadow-sm hover:shadow-md dark:bg-[#131324] dark:border-purple-900/40 dark:shadow-2xl dark:shadow-black/40 dark:hover:border-purple-500/60 dark:hover:shadow-purple-950/40 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Vehicle Image */}
        <div className="relative h-52 bg-gray-100 dark:bg-[#0c0c16] flex items-center justify-center overflow-hidden border-b border-gray-100 dark:border-purple-950/60">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.querySelector('.fallback-icon')?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`fallback-icon ${vehicle.imageUrl ? 'hidden' : 'flex'} w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-[#121222] dark:to-[#1a1a2e] items-center justify-center`}>
            <Car className="h-20 w-20 text-primary-300 dark:text-purple-700/50 group-hover:text-primary-400 dark:group-hover:text-purple-500/70 transition-colors" />
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-sm ${
                categoryColors[vehicle.category] || 'bg-gray-100 text-gray-700 dark:bg-purple-950/80 dark:text-purple-300'
              }`}
            >
              {vehicle.category}
            </span>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="text-white font-extrabold text-xs tracking-widest uppercase bg-red-600 px-3.5 py-1.5 rounded-md shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Vehicle Details */}
        <div className="p-5">
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-purple-300 transition-colors">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.description && (
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                {vehicle.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0">
        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-100 dark:border-purple-950/60">
          <div className="flex items-center text-2xl font-black text-primary-600 dark:text-purple-400 tracking-tight">
            <DollarSign className="h-5 w-5 -mr-0.5" />
            <span>{formatPrice(vehicle.price).replace('$', '')}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs">
            <Package className="h-4 w-4 text-gray-400 dark:text-slate-400" />
            <span
              className={`font-semibold ${
                vehicle.quantity === 0
                  ? 'text-red-500 dark:text-red-400'
                  : vehicle.quantity < 3
                  ? 'text-amber-500 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {vehicle.quantity} {vehicle.quantity === 1 ? 'unit' : 'units'} left
            </span>
          </div>
        </div>

        {/* Purchase Button */}
        <button
          onClick={() => onPurchase(vehicle._id)}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm ${
            isOutOfStock
              ? 'bg-gray-100 dark:bg-[#1a1a2e] text-gray-400 dark:text-slate-500 cursor-not-allowed border border-gray-200 dark:border-slate-800'
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md dark:bg-gradient-to-r dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-500 dark:hover:to-indigo-500 dark:shadow-lg dark:shadow-purple-950 dark:hover:shadow-purple-700/50 active:scale-[0.98]'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{isOutOfStock ? 'Currently Unavailable' : 'Purchase Vehicle'}</span>
        </button>
      </div>
    </div>
  );
}
