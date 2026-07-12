import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/db';
import jwt from 'jsonwebtoken';
import { env } from '../../src/config/env';

jest.mock('../../src/config/db', () => ({
  prisma: {
    vehicle: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('Vehicle Integration Tests', () => {
  const userPayload = { id: 'user-123', email: 'user@example.com', role: 'USER' };
  const adminPayload = { id: 'admin-123', email: 'admin@example.com', role: 'ADMIN' };

  const userToken = jwt.sign(userPayload, env.JWT_SECRET);
  const adminToken = jwt.sign(adminPayload, env.JWT_SECRET);

  const mockVehicle = {
    id: 'vehicle-uuid-1',
    name: 'My Model 3',
    make: 'Tesla',
    model: 'Model 3',
    category: 'Sedan',
    price: 45000.0,
    quantity: 5,
    year: 2022,
    color: 'Red',
    licensePlate: 'TSLA-001',
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockVehicle2 = {
    id: 'vehicle-uuid-2',
    name: 'Admin Cruiser',
    make: 'Ford',
    model: 'Explorer',
    category: 'SUV',
    price: 35000.0,
    quantity: 2,
    year: 2021,
    color: 'Black',
    licensePlate: 'FORD-999',
    userId: 'admin-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/vehicles', () => {
    it('should create a vehicle successfully', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.vehicle.create as jest.Mock).mockResolvedValue(mockVehicle);

      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'My Model 3',
          make: 'Tesla',
          model: 'Model 3',
          category: 'Sedan',
          price: 45000.0,
          quantity: 5,
          year: 2022,
          color: 'Red',
          licensePlate: 'TSLA-001',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.licensePlate).toBe('TSLA-001');
    });

    it('should fail validation if fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'Tesla',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail if license plate is duplicate', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(mockVehicle);

      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'My Model 3',
          make: 'Tesla',
          model: 'Model 3',
          category: 'Sedan',
          price: 45000.0,
          quantity: 5,
          year: 2022,
          color: 'Red',
          licensePlate: 'TSLA-001',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already registered');
    });
  });

  describe('GET /api/v1/vehicles', () => {
    it('should list only the user\'s vehicles for USER role', async () => {
      (prisma.vehicle.findMany as jest.Mock).mockResolvedValue([mockVehicle]);

      const response = await request(app)
        .get('/api/v1/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/v1/vehicles/search', () => {
    it('should search vehicles successfully', async () => {
      (prisma.vehicle.findMany as jest.Mock).mockResolvedValue([mockVehicle]);

      const response = await request(app)
        .get('/api/v1/vehicles/search?make=Tesla&minPrice=40000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/v1/vehicles/:id/purchase', () => {
    it('should purchase a vehicle successfully and decrement stock', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(mockVehicle);
      (prisma.vehicle.update as jest.Mock).mockResolvedValue({ ...mockVehicle, quantity: mockVehicle.quantity - 1 });

      const response = await request(app)
        .post(`/api/v1/vehicles/${mockVehicle.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(mockVehicle.quantity - 1);
    });

    it('should fail purchase if vehicle is out of stock', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue({ ...mockVehicle, quantity: 0 });

      const response = await request(app)
        .post(`/api/v1/vehicles/${mockVehicle.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('out of stock');
    });
  });

  describe('POST /api/v1/vehicles/:id/restock', () => {
    it('should allow admin to restock quantity', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(mockVehicle);
      (prisma.vehicle.update as jest.Mock).mockResolvedValue({ ...mockVehicle, quantity: mockVehicle.quantity + 10 });

      const response = await request(app)
        .post(`/api/v1/vehicles/${mockVehicle.id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(mockVehicle.quantity + 10);
    });

    it('should reject restock for non-admin user', async () => {
      const response = await request(app)
        .post(`/api/v1/vehicles/${mockVehicle.id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});
