import { prisma } from '../config/db';
import { Prisma, Vehicle } from '@prisma/client';

export class VehicleRepository {
  async create(data: Prisma.VehicleUncheckedCreateInput): Promise<Vehicle> {
    return prisma.vehicle.create({
      data,
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({
      where: { id },
    });
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({
      where: { licensePlate },
    });
  }

  async findAllByUserId(userId: string): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle> {
    return prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Vehicle> {
    return prisma.vehicle.delete({
      where: { id },
    });
  }
}
