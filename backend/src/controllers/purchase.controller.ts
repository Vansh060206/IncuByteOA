import { Request, Response, NextFunction } from 'express';
import { PurchaseService } from '../services/purchase.service';
import { AppError } from '../utils/errors';

export class PurchaseController {
  private purchaseService: PurchaseService;

  constructor() {
    this.purchaseService = new PurchaseService();
  }

  purchase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized access', 401);
      }
      const userId = req.user.id;
      const vehicleId = req.params.id as string;
      const quantity = parseInt(req.body.quantity) || 1;

      const purchase = await this.purchaseService.purchaseVehicle(userId, vehicleId, quantity);
      return res.status(200).json({
        success: true,
        message: 'Vehicle purchased successfully',
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  };

  restock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicleId = req.params.id as string;
      const quantity = parseInt(req.body.quantity);

      if (isNaN(quantity) || quantity <= 0) {
        throw new AppError('Invalid quantity value', 400);
      }

      const vehicle = await this.purchaseService.restockVehicle(vehicleId, quantity);
      return res.status(200).json({
        success: true,
        message: 'Vehicle restocked successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };
}
