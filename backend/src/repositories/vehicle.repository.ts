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

  async search(filters: {
    make?: string;
    model?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Vehicle[]> {
    const where: Prisma.VehicleWhereInput = {};

    if (filters.make) {
      where.make = { contains: filters.make, mode: 'insensitive' };
    }
    if (filters.model) {
      where.model = { contains: filters.model, mode: 'insensitive' };
    }
    if (filters.category) {
      where.category = { contains: filters.category, mode: 'insensitive' };
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    return prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string): Promise<Vehicle> {
    return prisma.vehicle.delete({
      where: { id },
    });
  }
}
