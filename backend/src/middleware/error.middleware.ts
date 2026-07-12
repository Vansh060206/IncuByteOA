import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else {
    logger.error(`Unhandled Error: ${err.message}`, { stack: err.stack });
  }

  // Handle Prisma database errors
  if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database constraint violation';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
