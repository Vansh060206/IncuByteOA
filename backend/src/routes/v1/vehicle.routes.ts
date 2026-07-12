import { Router } from 'express';
import { VehicleController } from '../../controllers/vehicle.controller';
import { createVehicleValidator, updateVehicleValidator } from '../../validators/vehicle.validator';
import { validateRequest } from '../../middleware/validation.middleware';
import { auth } from '../../middleware/auth.middleware';

const router = Router();
const vehicleController = new VehicleController();

// All routes are protected by auth middleware
router.use(auth);

router.post('/', createVehicleValidator, validateRequest, vehicleController.createVehicle);
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', updateVehicleValidator, validateRequest, vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

export default router;
