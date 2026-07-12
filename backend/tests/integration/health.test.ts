import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/db';

jest.mock('../../src/config/db', () => ({
  prisma: {
    $queryRaw: jest.fn(),
  },
}));

describe('GET /api/v1/health', () => {
  it('should return 200 and healthy status when DB is reachable', async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'System is healthy',
      data: expect.objectContaining({
        database: 'connected',
      }),
    });
  });

  it('should return 500 when database connection fails', async () => {
    (prisma.$queryRaw as jest.Mock).mockRejectedValue(new Error('Connection failure'));

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: 'System is unhealthy',
      errors: [{ message: 'Connection failure' }],
    });
  });
});
