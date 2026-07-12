import { body } from 'express-validator';

export const vehicleCreateValidator = [
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number greater than 0'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
];

export const vehicleUpdateValidator = [
  body('make').optional().trim().notEmpty().withMessage('Make cannot be empty'),
  body('model').optional().trim().notEmpty().withMessage('Model cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number greater than 0'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
];

export const purchaseValidator = [
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer greater than or equal to 1'),
];

export const restockValidator = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer greater than or equal to 1'),
];
