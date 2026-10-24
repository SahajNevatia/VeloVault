const express = require('express');
const {
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
} = require('../controllers/vehicleController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Public route for searching (still requires auth per spec, but search is accessible)
// GET /api/vehicles/search - Search vehicles with filters
router.get('/search', authenticate, searchVehicles);

// GET /api/vehicles - List all vehicles
router.get('/', authenticate, getAllVehicles);

// GET /api/vehicles/:id - Get single vehicle
router.get('/:id', authenticate, idValidation, validate, getVehicleById);

// POST /api/vehicles - Add a new vehicle (authenticated users)
router.post('/', authenticate, vehicleValidation, validate, createVehicle);

// PUT /api/vehicles/:id - Update vehicle details
router.put('/:id', authenticate, idValidation, validate, updateVehicle);

// DELETE /api/vehicles/:id - Delete a vehicle (Admin only)
router.delete('/:id', authenticate, authorizeAdmin, idValidation, validate, deleteVehicle);

// POST /api/vehicles/:id/purchase - Purchase a vehicle
router.post('/:id/purchase', authenticate, idValidation, validate, purchaseVehicle);

// POST /api/vehicles/:id/restock - Restock a vehicle (Admin only)
router.post('/:id/restock', authenticate, authorizeAdmin, idValidation, validate, restockVehicle);

module.exports = router;
