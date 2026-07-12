import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service';

export class VehicleController {
  private vehicleService: VehicleService;

  constructor() {
    this.vehicleService = new VehicleService();
  }

  createVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, make, model, year, color, licensePlate, category, price, quantity } = req.body;
      const userId = req.user!.id;

      const vehicle = await this.vehicleService.createVehicle({
        name,
        make,
        model,
        year,
        color,
        licensePlate,
        category,
        price: Number(price),
        quantity: quantity !== undefined ? Number(quantity) : 0,
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

  searchVehicles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { make, model, category, minPrice, maxPrice } = req.query;

      const vehicles = await this.vehicleService.searchVehicles({
        make: make as string,
        model: model as string,
        category: category as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });

      return res.status(200).json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  };

  purchaseVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const vehicle = await this.vehicleService.purchaseVehicle(id as string);

      return res.status(200).json({
        success: true,
        message: 'Vehicle purchased successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  restockVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const role = req.user!.role;

      const vehicle = await this.vehicleService.restockVehicle(id as string, Number(quantity), role);

      return res.status(200).json({
        success: true,
        message: 'Vehicle restocked successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };
}
