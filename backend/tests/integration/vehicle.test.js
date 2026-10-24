const request = require('supertest');
const app = require('../../src/app');
const Vehicle = require('../../src/models/Vehicle');

// Set env vars for testing
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.JWT_EXPIRES_IN = '1h';

require('../setup');

describe('Vehicle API Endpoints', () => {
  let userToken;
  let adminToken;

  // Helper to register and login a user
  const getAuthToken = async (role = 'user') => {
    const suffix = role === 'admin' ? 'admin' : 'user';
    await request(app)
      .post('/api/auth/register')
      .send({
        username: `test${suffix}${Date.now()}`,
        email: `${suffix}${Date.now()}@example.com`,
        password: 'password123',
        role,
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: `${suffix}${Date.now()}@example.com`,
        password: 'password123',
      });

    // If login fails due to timing, register fresh
    if (!loginRes.body.data) {
      const email = `${suffix}${Date.now() + 1}@example.com`;
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({
          username: `test${suffix}${Date.now() + 1}`,
          email,
          password: 'password123',
          role,
        });
      return regRes.body.data.token;
    }

    return loginRes.body.data.token;
  };

  const sampleVehicle = {
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    category: 'sedan',
    price: 42000,
    quantity: 8,
  };

  beforeEach(async () => {
    // Register both user and admin
    const userReg = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'regularuser',
        email: 'user@test.com',
        password: 'password123',
        role: 'user',
      });
    userToken = userReg.body.data.token;

    const adminReg = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'adminuser',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
      });
    adminToken = adminReg.body.data.token;
  });

  describe('POST /api/vehicles', () => {
    it('should create a vehicle when authenticated', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleVehicle);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.make).toBe('Tesla');
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .send(sampleVehicle);

      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid vehicle data', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ make: 'Tesla' }); // Missing required fields

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/vehicles', () => {
    it('should return all vehicles', async () => {
      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleVehicle);

      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.vehicles).toHaveLength(1);
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/vehicles');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/vehicles/search', () => {
    beforeEach(async () => {
      await Vehicle.create([
        { ...sampleVehicle, make: 'Toyota', model: 'Camry', category: 'sedan', price: 28000 },
        { ...sampleVehicle, make: 'Ford', model: 'F-150', category: 'truck', price: 45000 },
        { ...sampleVehicle, make: 'Honda', model: 'CR-V', category: 'suv', price: 32000 },
      ]);
    });

    it('should search vehicles by make', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=Toyota')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].make).toBe('Toyota');
    });

    it('should search vehicles by category', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?category=suv')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('should search vehicles by price range', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?minPrice=25000&maxPrice=35000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should update a vehicle', async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleVehicle);

      const vehicleId = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 39000 });

      expect(res.status).toBe(200);
      expect(res.body.data.price).toBe(39000);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should allow admin to delete a vehicle', async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleVehicle);

      const vehicleId = createRes.body.data._id;

      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should deny non-admin users from deleting', async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleVehicle);

      const vehicleId = createRes.body.data._id;

      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should purchase a vehicle and decrease quantity', async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...sampleVehicle, quantity: 5 });

      const vehicleId = createRes.body.data._id;

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(200);
      expect(res.body.data.quantity).toBe(4);
    });

    it('should return 400 when insufficient stock', async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...sampleVehicle, quantity: 0 });

      const vehicleId = createRes.body.data._id;

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should allow admin to restock a vehicle', async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...sampleVehicle, quantity: 5 });

      const vehicleId = createRes.body.data._id;

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(200);
      expect(res.body.data.quantity).toBe(15);
    });

    it('should deny non-admin users from restocking', async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleVehicle);

      const vehicleId = createRes.body.data._id;

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });

      expect(res.status).toBe(403);
    });
  });

  describe('API Health Check', () => {
    it('should return 200 for health check endpoint', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for undefined routes', async () => {
      const res = await request(app).get('/api/nonexistent');

      expect(res.status).toBe(404);
    });
  });
});
