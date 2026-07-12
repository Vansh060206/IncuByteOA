import app from './app';
import { env } from './config/env';
import { prisma } from './config/db';
import { logger } from './config/logger';

const startServer = async () => {
  try {
    logger.info('Connecting to database...');
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection established successfully');

    app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
      logger.info(`📖 API Docs available at http://localhost:${env.PORT}/api/docs`);
    });
  } catch (error: any) {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
