const mongoose = require('mongoose');
const Vehicle = require('../../src/models/Vehicle');

require('../setup');

describe('Vehicle Model', () => {
  const validVehicleData = {
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    category: 'sedan',
    price: 28000,
    quantity: 5,
    description: 'Reliable mid-size sedan with great fuel economy',
  };

  describe('Validation', () => {
    it('should create a valid vehicle successfully', async () => {
      const vehicle = await Vehicle.create(validVehicleData);

      expect(vehicle._id).toBeDefined();
      expect(vehicle.make).toBe('Toyota');
      expect(vehicle.model).toBe('Camry');
      expect(vehicle.year).toBe(2024);
      expect(vehicle.category).toBe('sedan');
      expect(vehicle.price).toBe(28000);
      expect(vehicle.quantity).toBe(5);
    });

    it('should fail without required make', async () => {
      const data = { ...validVehicleData };
      delete data.make;

      await expect(Vehicle.create(data)).rejects.toThrow();
    });

    it('should fail without required model', async () => {
      const data = { ...validVehicleData };
      delete data.model;

      await expect(Vehicle.create(data)).rejects.toThrow();
    });

    it('should fail without required year', async () => {
      const data = { ...validVehicleData };
      delete data.year;

      await expect(Vehicle.create(data)).rejects.toThrow();
    });

    it('should fail without required category', async () => {
      const data = { ...validVehicleData };
      delete data.category;

      await expect(Vehicle.create(data)).rejects.toThrow();
    });

    it('should fail without required price', async () => {
      const data = { ...validVehicleData };
      delete data.price;

      await expect(Vehicle.create(data)).rejects.toThrow();
    });

    it('should fail with invalid category', async () => {
      const data = { ...validVehicleData, category: 'spaceship' };

      await expect(Vehicle.create(data)).rejects.toThrow();
    });

    it('should fail with negative price', async () => {
      const data = { ...validVehicleData, price: -1000 };

      await expect(Vehicle.create(data)).rejects.toThrow();
    });

    it('should fail with negative quantity', async () => {
      const data = { ...validVehicleData, quantity: -1 };

      await expect(Vehicle.create(data)).rejects.toThrow();
    });

    it('should fail with year before 1900', async () => {
      const data = { ...validVehicleData, year: 1800 };

      await expect(Vehicle.create(data)).rejects.toThrow();
    });

    it('should fail with year after 2030', async () => {
      const data = { ...validVehicleData, year: 2050 };

      await expect(Vehicle.create(data)).rejects.toThrow();
    });

    it('should default quantity to 0 if not provided', async () => {
      const data = { ...validVehicleData };
      delete data.quantity;

      const vehicle = await Vehicle.create(data);
      expect(vehicle.quantity).toBe(0);
    });

    it('should accept all valid categories', async () => {
      const categories = ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'convertible', 'van', 'wagon'];

      for (let i = 0; i < categories.length; i++) {
        const vehicle = await Vehicle.create({
          ...validVehicleData,
          category: categories[i],
          make: `Make${i}`,
        });
        expect(vehicle.category).toBe(categories[i]);
      }
    });
  });

  describe('Timestamps', () => {
    it('should automatically add createdAt and updatedAt', async () => {
      const vehicle = await Vehicle.create(validVehicleData);

      expect(vehicle.createdAt).toBeDefined();
      expect(vehicle.updatedAt).toBeDefined();
      expect(vehicle.createdAt).toBeInstanceOf(Date);
    });
  });
});
