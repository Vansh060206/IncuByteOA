import { prisma } from '../config/db';
import { Prisma, Vehicle } from '@prisma/client';

export interface VehicleSearchFilters {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class VehicleRepository {
  async create(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return prisma.vehicle.create({ data });
  }

  async findById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({ where: { id } });
  }

  async findAll(skip = 0, take = 20): Promise<{ vehicles: Vehicle[]; total: number }> {
    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.vehicle.count(),
    ]);
    return { vehicles, total };
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

  async search(filters: VehicleSearchFilters): Promise<Vehicle[]> {
    const whereClause: Prisma.VehicleWhereInput = {};

    if (filters.make) {
      whereClause.make = { contains: filters.make, mode: 'insensitive' };
    }
    if (filters.model) {
      whereClause.model = { contains: filters.model, mode: 'insensitive' };
    }
    if (filters.category) {
      whereClause.category = { equals: filters.category, mode: 'insensitive' };
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      whereClause.price = {};
      if (filters.minPrice !== undefined) {
        whereClause.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        whereClause.price.lte = filters.maxPrice;
      }
    }

    return prisma.vehicle.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }
}
