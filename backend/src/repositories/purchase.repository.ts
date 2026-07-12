import { prisma } from '../config/db';
import { PurchaseHistory } from '@prisma/client';

export class PurchaseRepository {
  async createPurchaseTransaction(
    userId: string,
    vehicleId: string,
    quantity: number
  ): Promise<PurchaseHistory> {
    return prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({
        where: { id: vehicleId },
      });

      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      if (vehicle.quantity < quantity) {
        throw new Error('Insufficient stock');
      }

      await tx.vehicle.update({
        where: { id: vehicleId },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      const purchase = await tx.purchaseHistory.create({
        data: {
          userId,
          vehicleId,
          quantity,
        },
      });

      return purchase;
    });
  }

  async findByUserId(userId: string): Promise<PurchaseHistory[]> {
    return prisma.purchaseHistory.findMany({
      where: { userId },
      include: {
        vehicle: true,
      },
      orderBy: { purchaseDate: 'desc' },
    });
  }
}
