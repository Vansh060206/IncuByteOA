import { body } from 'express-validator';

const currentYear = new Date().getFullYear();

export const createVehicleValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year')
    .isInt({ min: 1886, max: currentYear + 1 })
    .withMessage(`Year must be a valid integer between 1886 and ${currentYear + 1}`),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('licensePlate')
    .trim()
    .notEmpty()
    .withMessage('License plate is required')
    .toUpperCase(),
];

export const updateVehicleValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('make').optional().trim().notEmpty().withMessage('Make cannot be empty'),
  body('model').optional().trim().notEmpty().withMessage('Model cannot be empty'),
  body('year')
    .optional()
    .isInt({ min: 1886, max: currentYear + 1 })
    .withMessage(`Year must be a valid integer between 1886 and ${currentYear + 1}`),
  body('color').optional().trim().notEmpty().withMessage('Color cannot be empty'),
  body('licensePlate')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('License plate cannot be empty')
    .toUpperCase(),
];
