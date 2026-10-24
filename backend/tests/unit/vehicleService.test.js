const mongoose = require('mongoose');
const Vehicle = require('../../src/models/Vehicle');
const vehicleService = require('../../src/services/vehicleService');

require('../setup');

describe('Vehicle Service', () => {
  const sampleVehicle = {
    make: 'Honda',
    model: 'Civic',
    year: 2024,
    category: 'sedan',
    price: 25000,
    quantity: 10,
    description: 'Popular compact sedan',
  };

  describe('createVehicle', () => {
    it('should create a new vehicle successfully', async () => {
      const vehicle = await vehicleService.createVehicle(sampleVehicle);

      expect(vehicle._id).toBeDefined();
      expect(vehicle.make).toBe('Honda');
      expect(vehicle.model).toBe('Civic');
      expect(vehicle.price).toBe(25000);
    });

    it('should throw an error with invalid data', async () => {
      await expect(
        vehicleService.createVehicle({ make: 'Honda' })
      ).rejects.toThrow();
    });
  });

  describe('getAllVehicles', () => {
    it('should return an empty list when no vehicles exist', async () => {
      const result = await vehicleService.getAllVehicles();

      expect(result.vehicles).toHaveLength(0);
      expect(result.pagination.totalItems).toBe(0);
    });

    it('should return all vehicles with pagination', async () => {
      await Vehicle.create(sampleVehicle);
      await Vehicle.create({ ...sampleVehicle, make: 'Toyota', model: 'Corolla' });

      const result = await vehicleService.getAllVehicles(1, 10);

      expect(result.vehicles).toHaveLength(2);
      expect(result.pagination.totalItems).toBe(2);
      expect(result.pagination.currentPage).toBe(1);
    });

    it('should paginate results correctly', async () => {
      for (let i = 0; i < 15; i++) {
        await Vehicle.create({
          ...sampleVehicle,
          make: `Make${i}`,
          model: `Model${i}`,
        });
      }

      const page1 = await vehicleService.getAllVehicles(1, 5);
      const page2 = await vehicleService.getAllVehicles(2, 5);

      expect(page1.vehicles).toHaveLength(5);
      expect(page2.vehicles).toHaveLength(5);
      expect(page1.pagination.totalPages).toBe(3);
    });
  });

  describe('searchVehicles', () => {
    beforeEach(async () => {
      await Vehicle.create([
        { ...sampleVehicle, make: 'Toyota', model: 'Camry', category: 'sedan', price: 28000 },
        { ...sampleVehicle, make: 'Ford', model: 'F-150', category: 'truck', price: 45000 },
        { ...sampleVehicle, make: 'Honda', model: 'CR-V', category: 'suv', price: 32000 },
        { ...sampleVehicle, make: 'Toyota', model: 'RAV4', category: 'suv', price: 30000 },
      ]);
    });

    it('should search by make (case-insensitive)', async () => {
      const results = await vehicleService.searchVehicles({ make: 'toyota' });
      expect(results).toHaveLength(2);
    });

    it('should search by category', async () => {
      const results = await vehicleService.searchVehicles({ category: 'suv' });
      expect(results).toHaveLength(2);
    });

    it('should search by price range', async () => {
      const results = await vehicleService.searchVehicles({
        minPrice: 25000,
        maxPrice: 35000,
      });
      expect(results).toHaveLength(3);
    });

    it('should search by model', async () => {
      const results = await vehicleService.searchVehicles({ model: 'Camry' });
      expect(results).toHaveLength(1);
      expect(results[0].model).toBe('Camry');
    });

    it('should return all vehicles when no filters are provided', async () => {
      const results = await vehicleService.searchVehicles({});
      expect(results).toHaveLength(4);
    });

    it('should combine multiple search filters', async () => {
      const results = await vehicleService.searchVehicles({
        make: 'Toyota',
        category: 'suv',
      });
      expect(results).toHaveLength(1);
      expect(results[0].model).toBe('RAV4');
    });
  });

  describe('getVehicleById', () => {
    it('should return a vehicle by its ID', async () => {
      const created = await Vehicle.create(sampleVehicle);
      const vehicle = await vehicleService.getVehicleById(created._id);

      expect(vehicle.make).toBe('Honda');
      expect(vehicle.model).toBe('Civic');
    });

    it('should throw 404 for non-existent vehicle', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      try {
        await vehicleService.getVehicleById(fakeId);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.message).toBe('Vehicle not found.');
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe('updateVehicle', () => {
    it('should update vehicle details', async () => {
      const created = await Vehicle.create(sampleVehicle);
      const updated = await vehicleService.updateVehicle(created._id, {
        price: 27000,
      });

      expect(updated.price).toBe(27000);
      expect(updated.make).toBe('Honda'); // Unchanged fields remain
    });

    it('should throw 404 for non-existent vehicle', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      try {
        await vehicleService.updateVehicle(fakeId, { price: 27000 });
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe('deleteVehicle', () => {
    it('should delete an existing vehicle', async () => {
      const created = await Vehicle.create(sampleVehicle);
      await vehicleService.deleteVehicle(created._id);

      const found = await Vehicle.findById(created._id);
      expect(found).toBeNull();
    });

    it('should throw 404 for non-existent vehicle', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      try {
        await vehicleService.deleteVehicle(fakeId);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe('purchaseVehicle', () => {
    it('should decrease quantity on purchase', async () => {
      const created = await Vehicle.create({ ...sampleVehicle, quantity: 5 });
      const result = await vehicleService.purchaseVehicle(created._id, 1);

      expect(result.quantity).toBe(4);
    });

    it('should allow purchasing multiple units', async () => {
      const created = await Vehicle.create({ ...sampleVehicle, quantity: 10 });
      const result = await vehicleService.purchaseVehicle(created._id, 3);

      expect(result.quantity).toBe(7);
    });

    it('should throw error when insufficient stock', async () => {
      const created = await Vehicle.create({ ...sampleVehicle, quantity: 1 });

      try {
        await vehicleService.purchaseVehicle(created._id, 5);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toContain('Insufficient stock');
      }
    });

    it('should throw 404 for non-existent vehicle', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      try {
        await vehicleService.purchaseVehicle(fakeId, 1);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });

    it('should allow purchasing when exact quantity matches stock', async () => {
      const created = await Vehicle.create({ ...sampleVehicle, quantity: 3 });
      const result = await vehicleService.purchaseVehicle(created._id, 3);

      expect(result.quantity).toBe(0);
    });
  });

  describe('restockVehicle', () => {
    it('should increase quantity on restock', async () => {
      const created = await Vehicle.create({ ...sampleVehicle, quantity: 5 });
      const result = await vehicleService.restockVehicle(created._id, 10);

      expect(result.quantity).toBe(15);
    });

    it('should throw error for zero quantity restock', async () => {
      const created = await Vehicle.create(sampleVehicle);

      try {
        await vehicleService.restockVehicle(created._id, 0);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });

    it('should throw error for negative quantity restock', async () => {
      const created = await Vehicle.create(sampleVehicle);

      try {
        await vehicleService.restockVehicle(created._id, -5);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });

    it('should throw 404 for non-existent vehicle', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      try {
        await vehicleService.restockVehicle(fakeId, 5);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });
});
