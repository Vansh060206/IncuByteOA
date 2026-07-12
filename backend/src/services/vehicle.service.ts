import { VehicleRepository, VehicleSearchFilters } from '../repositories/vehicle.repository';
import { AppError } from '../utils/errors';
import { Prisma } from '@prisma/client';

export class VehicleService {
  private vehicleRepository: VehicleRepository;

  constructor() {
    this.vehicleRepository = new VehicleRepository();
  }

  async createVehicle(data: Prisma.VehicleCreateInput) {
    return this.vehicleRepository.create(data);
  }

  async getVehicleById(id: string) {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    return vehicle;
  }

  async getAllVehicles(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.vehicleRepository.findAll(skip, limit);
  }

  async updateVehicle(id: string, data: Prisma.VehicleUpdateInput) {
    await this.getVehicleById(id);
    return this.vehicleRepository.update(id, data);
  }

  async deleteVehicle(id: string) {
    await this.getVehicleById(id);
    return this.vehicleRepository.delete(id);
  }

  async searchVehicles(filters: VehicleSearchFilters) {
    return this.vehicleRepository.search(filters);
  }
}
