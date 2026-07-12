import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/db';
import jwt from 'jsonwebtoken';
import { env } from '../../src/config/env';

jest.mock('../../src/config/db', () => ({
  prisma: {
    vehicle: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    purchaseHistory: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('Vehicle and Inventory Integration Tests', () => {
  const adminToken = jwt.sign({ id: 'admin-id', email: 'admin@example.com', role: 'ADMIN' }, env.JWT_SECRET);
  const userToken = jwt.sign({ id: 'user-id', email: 'user@example.com', role: 'USER' }, env.JWT_SECRET);

  const mockVehicle = {
    id: 'vehicle-uuid',
    make: 'Toyota',
    model: 'RAV4',
    category: 'SUV',
    price: 32000.00,
    quantity: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/vehicles', () => {
    it('should return 401 Unauthorized when request is unauthenticated', async () => {
      const response = await request(app).get('/api/v1/vehicles');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return paginated list of vehicles when authenticated', async () => {
      (prisma.vehicle.findMany as jest.Mock).mockResolvedValue([mockVehicle]);
      (prisma.vehicle.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app)
        .get('/api/v1/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.vehicles).toHaveLength(1);
    });
  });

  describe('POST /api/v1/vehicles', () => {
    it('should allow ADMIN to create a new vehicle', async () => {
      (prisma.vehicle.create as jest.Mock).mockResolvedValue(mockVehicle);

      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Toyota',
          model: 'RAV4',
          category: 'SUV',
          price: 32000.00,
          quantity: 5,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should block USER role from creating a vehicle', async () => {
      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'Toyota',
          model: 'RAV4',
          category: 'SUV',
          price: 32000.00,
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/vehicles/:id/purchase', () => {
    it('should allow user to purchase vehicle', async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const txMock = {
          vehicle: {
            findUnique: jest.fn().mockResolvedValue(mockVehicle),
            update: jest.fn().mockResolvedValue(mockVehicle),
          },
          purchaseHistory: {
            create: jest.fn().mockResolvedValue({ id: 'purchase-id' }),
          },
        };
        return callback(txMock);
      });

      const response = await request(app)
        .post(`/api/v1/vehicles/${mockVehicle.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should fail purchase if stock is empty', async () => {
      const outOfStockVehicle = { ...mockVehicle, quantity: 0 };
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const txMock = {
          vehicle: {
            findUnique: jest.fn().mockResolvedValue(outOfStockVehicle),
          },
        };
        return callback(txMock);
      });

      const response = await request(app)
        .post(`/api/v1/vehicles/${mockVehicle.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
