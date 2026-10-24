const mongoose = require('mongoose');

/**
 * Vehicle Schema for the VeloVault inventory system.
 * Each vehicle has a unique combination of make, model, year, and category.
 * Tracks pricing and stock quantity for inventory management.
 */
const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true,
      maxlength: [50, 'Make cannot exceed 50 characters'],
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
      maxlength: [50, 'Model cannot exceed 50 characters'],
    },
    year: {
      type: Number,
      required: [true, 'Vehicle year is required'],
      min: [1900, 'Year must be 1900 or later'],
      max: [2030, 'Year cannot exceed 2030'],
    },
    category: {
      type: String,
      required: [true, 'Vehicle category is required'],
      enum: {
        values: ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'convertible', 'van', 'wagon'],
        message: '{VALUE} is not a valid vehicle category',
      },
    },
    price: {
      type: Number,
      required: [true, 'Vehicle price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity in stock is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient search queries
vehicleSchema.index({ make: 1, model: 1 });
vehicleSchema.index({ category: 1 });
vehicleSchema.index({ price: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);
