import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import { prisma } from '../../config/db';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      success: true,
      message: 'System is healthy',
      data: {
        uptime: process.uptime(),
        database: 'connected',
        timestamp: new Date(),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'System is unhealthy',
      errors: [{ message: error.message || 'Database connection error' }],
    });
  }
});

router.use('/auth', authRoutes);

export default router;
