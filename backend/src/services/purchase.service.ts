import { PurchaseRepository } from '../repositories/purchase.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { AppError } from '../utils/errors';

export class PurchaseService {
  private purchaseRepository: PurchaseRepository;
  private vehicleRepository: VehicleRepository;

  constructor() {
    this.purchaseRepository = new PurchaseRepository();
    this.vehicleRepository = new VehicleRepository();
  }

  async purchaseVehicle(userId: string, vehicleId: string, quantity: number) {
    if (quantity <= 0) {
      throw new AppError('Quantity must be greater than zero', 400);
    }

    try {
      return await this.purchaseRepository.createPurchaseTransaction(userId, vehicleId, quantity);
    } catch (error: any) {
      if (error.message === 'Vehicle not found') {
        throw new AppError('Vehicle not found', 404);
      }
      if (error.message === 'Insufficient stock') {
        throw new AppError('Vehicle is out of stock or requested quantity exceeds available stock', 400);
      }
      throw new AppError(error.message || 'Purchase transaction failed', 500);
    }
  }

  async restockVehicle(vehicleId: string, quantity: number) {
    if (quantity <= 0) {
      throw new AppError('Restock quantity must be greater than zero', 400);
    }

    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    return this.vehicleRepository.update(vehicleId, {
      quantity: {
        increment: quantity,
      },
    });
  }
}
