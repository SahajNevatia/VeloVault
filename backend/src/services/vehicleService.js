const Vehicle = require('../models/Vehicle');

/**
 * Service layer for vehicle inventory operations.
 * Handles all business logic for CRUD and inventory management.
 */
class VehicleService {
  /**
   * Creates a new vehicle entry in the inventory.
   * @param {Object} vehicleData - Vehicle details
   * @returns {Object} The created vehicle document
   */
  async createVehicle(vehicleData) {
    const vehicle = await Vehicle.create(vehicleData);
    return vehicle;
  }

  /**
   * Retrieves all vehicles from the inventory.
   * Supports pagination via page and limit query params.
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @returns {Object} Paginated vehicle list with metadata
   */
  async getAllVehicles(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [vehicles, total] = await Promise.all([
      Vehicle.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Vehicle.countDocuments(),
    ]);

    return {
      vehicles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Searches vehicles based on filters.
   * Supports searching by make, model, category, and price range.
   * @param {Object} filters - Search criteria
   * @returns {Array} Matching vehicles
   */
  async searchVehicles({ make, model, category, minPrice, maxPrice }) {
    const query = {};

    if (make) {
      query.make = { $regex: make, $options: 'i' };
    }
    if (model) {
      query.model = { $regex: model, $options: 'i' };
    }
    if (category) {
      query.category = category.toLowerCase();
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    return vehicles;
  }

  /**
   * Retrieves a single vehicle by its ID.
   * @param {string} id - Vehicle MongoDB ObjectId
   * @returns {Object} Vehicle document
   * @throws {Error} If vehicle is not found
   */
  async getVehicleById(id) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      const error = new Error('Vehicle not found.');
      error.statusCode = 404;
      throw error;
    }
    return vehicle;
  }

  /**
   * Updates an existing vehicle's details.
   * @param {string} id - Vehicle MongoDB ObjectId
   * @param {Object} updateData - Fields to update
   * @returns {Object} Updated vehicle document
   * @throws {Error} If vehicle is not found
   */
  async updateVehicle(id, updateData) {
    const vehicle = await Vehicle.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) {
      const error = new Error('Vehicle not found.');
      error.statusCode = 404;
      throw error;
    }
    return vehicle;
  }

  /**
   * Deletes a vehicle from the inventory.
   * @param {string} id - Vehicle MongoDB ObjectId
   * @returns {Object} Deleted vehicle document
   * @throws {Error} If vehicle is not found
   */
  async deleteVehicle(id) {
    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      const error = new Error('Vehicle not found.');
      error.statusCode = 404;
      throw error;
    }
    return vehicle;
  }

  /**
   * Processes a vehicle purchase by decreasing quantity.
   * @param {string} id - Vehicle MongoDB ObjectId
   * @param {number} quantity - Number of units to purchase (default: 1)
   * @returns {Object} Updated vehicle document
   * @throws {Error} If vehicle not found or insufficient stock
   */
  async purchaseVehicle(id, quantity = 1) {
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      const error = new Error('Vehicle not found.');
      error.statusCode = 404;
      throw error;
    }

    if (vehicle.quantity < quantity) {
      const error = new Error(
        `Insufficient stock. Only ${vehicle.quantity} unit(s) available.`
      );
      error.statusCode = 400;
      throw error;
    }

    vehicle.quantity -= quantity;
    await vehicle.save();
    return vehicle;
  }

  /**
   * Restocks a vehicle by increasing its quantity.
   * Admin-only operation.
   * @param {string} id - Vehicle MongoDB ObjectId
   * @param {number} quantity - Number of units to add
   * @returns {Object} Updated vehicle document
   * @throws {Error} If vehicle not found or invalid quantity
   */
  async restockVehicle(id, quantity) {
    if (!quantity || quantity <= 0) {
      const error = new Error('Restock quantity must be a positive number.');
      error.statusCode = 400;
      throw error;
    }

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      const error = new Error('Vehicle not found.');
      error.statusCode = 404;
      throw error;
    }

    vehicle.quantity += quantity;
    await vehicle.save();
    return vehicle;
  }
}

module.exports = new VehicleService();
