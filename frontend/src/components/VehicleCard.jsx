import React from 'react';
import { ShoppingCart, Car, DollarSign, Package } from 'lucide-react';

/**
 * Vehicle card component styled with premium dark luxury & neon purple accents.
 * Displays vehicle imagery, specs, live stock, and dynamic purchase action.
 */
export default function VehicleCard({ vehicle, onPurchase }) {
  const isOutOfStock = vehicle.quantity === 0;

  // Format price with commas
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);

  // Category badge colors tailored for dark background
  const categoryColors = {
    sedan: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
    suv: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    truck: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    coupe: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
    hatchback: 'bg-teal-950/80 text-teal-300 border-teal-800/60',
    convertible: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
    van: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
    wagon: 'bg-orange-950/80 text-orange-300 border-orange-800/60',
  };

  return (
    <div className="card group bg-[#131324] border border-purple-900/40 rounded-xl overflow-hidden hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-950/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Vehicle Image */}
        <div className="relative h-52 bg-[#0c0c16] flex items-center justify-center overflow-hidden border-b border-purple-950/60">
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
          <div className={`fallback-icon ${vehicle.imageUrl ? 'hidden' : 'flex'} w-full h-full bg-gradient-to-br from-[#121222] to-[#1a1a2e] items-center justify-center`}>
            <Car className="h-20 w-20 text-purple-700/50 group-hover:text-purple-500/70 transition-colors" />
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border backdrop-blur-sm shadow-md ${
                categoryColors[vehicle.category] || 'bg-purple-950/80 text-purple-300 border-purple-800/60'
              }`}
            >
              {vehicle.category}
            </span>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="text-white font-extrabold text-sm tracking-widest uppercase bg-red-600/90 border border-red-500 px-3.5 py-1.5 rounded-md shadow-lg shadow-red-950">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Vehicle Details */}
        <div className="p-5">
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.description && (
              <p className="text-sm text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                {vehicle.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0">
        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4 pt-3 border-t border-purple-950/60">
          <div className="flex items-center text-2xl font-black text-purple-400 tracking-tight">
            <DollarSign className="h-5 w-5 -mr-0.5 text-purple-400" />
            <span>{formatPrice(vehicle.price).replace('$', '')}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs">
            <Package className="h-4 w-4 text-slate-400" />
            <span
              className={`font-semibold ${
                vehicle.quantity === 0
                  ? 'text-red-400'
                  : vehicle.quantity < 3
                  ? 'text-amber-400'
                  : 'text-emerald-400'
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
              ? 'bg-[#1a1a2e] text-slate-500 cursor-not-allowed border border-slate-800'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950 hover:shadow-purple-700/50 active:scale-[0.98]'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{isOutOfStock ? 'Currently Unavailable' : 'Purchase Vehicle'}</span>
        </button>
      </div>
    </div>
  );
}
