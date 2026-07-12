import { VehicleRepository } from '../repositories/vehicle.repository';
import { AppError } from '../utils/errors';
import { Prisma, Vehicle } from '@prisma/client';

export class VehicleService {
  private vehicleRepository: VehicleRepository;

  constructor() {
    this.vehicleRepository = new VehicleRepository();
  }

  async createVehicle(data: Prisma.VehicleUncheckedCreateInput): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findByLicensePlate(data.licensePlate);
    if (existingVehicle) {
      throw new AppError('Vehicle with this license plate is already registered', 400);
    }

    return this.vehicleRepository.create(data);
  }

  async getVehicles(userId: string, role: string): Promise<Vehicle[]> {
    if (role === 'ADMIN') {
      return this.vehicleRepository.findAll();
    }
    return this.vehicleRepository.findAllByUserId(userId);
  }

  async getVehicleById(id: string, userId: string, role: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    if (vehicle.userId !== userId && role !== 'ADMIN') {
      throw new AppError('Access denied: You do not own this vehicle', 403);
    }

    return vehicle;
  }

  async updateVehicle(
    id: string,
    data: Prisma.VehicleUpdateInput,
    userId: string,
    role: string
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    if (vehicle.userId !== userId && role !== 'ADMIN') {
      throw new AppError('Access denied: You do not own this vehicle', 403);
    }

    if (data.licensePlate && typeof data.licensePlate === 'string') {
      const existingVehicle = await this.vehicleRepository.findByLicensePlate(data.licensePlate);
      if (existingVehicle && existingVehicle.id !== id) {
        throw new AppError('Vehicle with this license plate is already registered', 400);
      }
    }

    return this.vehicleRepository.update(id, data);
  }

  async deleteVehicle(id: string, userId: string, role: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    if (vehicle.userId !== userId && role !== 'ADMIN') {
      throw new AppError('Access denied: You do not own this vehicle', 403);
    }

    return this.vehicleRepository.delete(id);
  }

  async searchVehicles(filters: {
    make?: string;
    model?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Vehicle[]> {
    return this.vehicleRepository.search(filters);
  }

  async purchaseVehicle(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    if (vehicle.quantity <= 0) {
      throw new AppError('Vehicle is out of stock', 400);
    }

    return this.vehicleRepository.update(id, {
      quantity: vehicle.quantity - 1,
    });
  }

  async restockVehicle(id: string, amount: number, role: string): Promise<Vehicle> {
    if (role !== 'ADMIN') {
      throw new AppError('Access denied: Admins only', 403);
    }

    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    if (amount <= 0) {
      throw new AppError('Restock amount must be greater than 0', 400);
    }

    return this.vehicleRepository.update(id, {
      quantity: vehicle.quantity + amount,
    });
  }
}
