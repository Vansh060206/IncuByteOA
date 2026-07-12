import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service';

export class VehicleController {
  private vehicleService: VehicleService;

  constructor() {
    this.vehicleService = new VehicleService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicle = await this.vehicleService.createVehicle(req.body);
      return res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicle = await this.vehicleService.getVehicleById(req.params.id as string);
      return res.status(200).json({
        success: true,
        message: 'Vehicle retrieved successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await this.vehicleService.getAllVehicles(page, limit);
      return res.status(200).json({
        success: true,
        message: 'Vehicles retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicle = await this.vehicleService.updateVehicle(req.params.id as string, req.body);
      return res.status(200).json({
        success: true,
        message: 'Vehicle updated successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.vehicleService.deleteVehicle(req.params.id as string);
      return res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        make: req.query.make as string,
        model: req.query.model as string,
        category: req.query.category as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      };
      const vehicles = await this.vehicleService.searchVehicles(filters);
      return res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  };
}
