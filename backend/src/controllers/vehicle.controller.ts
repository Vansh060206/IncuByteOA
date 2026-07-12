import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service';

export class VehicleController {
  private vehicleService: VehicleService;

  constructor() {
    this.vehicleService = new VehicleService();
  }

  createVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, make, model, year, color, licensePlate } = req.body;
      const userId = req.user!.id;

      const vehicle = await this.vehicleService.createVehicle({
        name,
        make,
        model,
        year,
        color,
        licensePlate,
        userId,
      });

      return res.status(201).json({
        success: true,
        message: 'Vehicle registered successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  getVehicles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;

      const vehicles = await this.vehicleService.getVehicles(userId, role);

      return res.status(200).json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  };

  getVehicleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const role = req.user!.role;

      const vehicle = await this.vehicleService.getVehicleById(id as string, userId, role);

      return res.status(200).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const role = req.user!.role;
      const updateData = req.body;

      const vehicle = await this.vehicleService.updateVehicle(id as string, updateData, userId, role);

      return res.status(200).json({
        success: true,
        message: 'Vehicle updated successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const role = req.user!.role;

      const vehicle = await this.vehicleService.deleteVehicle(id as string, userId, role);

      return res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };
}
