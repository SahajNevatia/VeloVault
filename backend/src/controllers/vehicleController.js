const { body, param, query } = require('express-validator');
const vehicleService = require('../services/vehicleService');

/**
 * Validation rules for creating/updating a vehicle.
 */
const vehicleValidation = [
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year')
    .isInt({ min: 1900, max: 2030 })
    .withMessage('Year must be between 1900 and 2030'),
  body('category')
    .isIn(['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'convertible', 'van', 'wagon'])
    .withMessage('Invalid vehicle category'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
];

/**
 * Validation rules for vehicle ID parameter.
 */
const idValidation = [
  param('id').isMongoId().withMessage('Invalid vehicle ID format'),
];

/**
 * Handles POST /api/vehicles
 * Creates a new vehicle in the inventory.
 */
const createVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully.',
      data: vehicle,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Handles GET /api/vehicles
 * Returns a paginated list of all vehicles.
 */
const getAllVehicles = async (req, res) => {
  try {
    // Sanitize pagination parameters defensively
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const result = await vehicleService.getAllVehicles(page, limit);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Handles GET /api/vehicles/search
 * Searches vehicles based on query parameters.
 */
const searchVehicles = async (req, res) => {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;
    const vehicles = await vehicleService.searchVehicles({
      make,
      model,
      category,
      minPrice,
      maxPrice,
    });

    res.status(200).json({
      success: true,
      data: vehicles,
      count: vehicles.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Handles GET /api/vehicles/:id
 * Returns a single vehicle by ID.
 */
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Handles PUT /api/vehicles/:id
 * Updates an existing vehicle's details.
 */
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully.',
      data: vehicle,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Handles DELETE /api/vehicles/:id
 * Deletes a vehicle from the inventory (Admin only).
 */
const deleteVehicle = async (req, res) => {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully.',
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Handles POST /api/vehicles/:id/purchase
 * Processes a vehicle purchase, decreasing stock.
 */
const purchaseVehicle = async (req, res) => {
  try {
    const quantity = parseInt(req.body.quantity) || 1;
    const vehicle = await vehicleService.purchaseVehicle(req.params.id, quantity);
    res.status(200).json({
      success: true,
      message: 'Vehicle purchased successfully.',
      data: vehicle,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Handles POST /api/vehicles/:id/restock
 * Restocks a vehicle, increasing its quantity (Admin only).
 */
const restockVehicle = async (req, res) => {
  try {
    const quantity = parseInt(req.body.quantity);
    const vehicle = await vehicleService.restockVehicle(req.params.id, quantity);
    res.status(200).json({
      success: true,
      message: 'Vehicle restocked successfully.',
      data: vehicle,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  searchVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
  vehicleValidation,
  idValidation,
};
