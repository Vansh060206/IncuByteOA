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
}
