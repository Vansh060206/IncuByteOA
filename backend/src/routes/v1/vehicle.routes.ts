import { Router } from 'express';
import { VehicleController } from '../../controllers/vehicle.controller';
import { PurchaseController } from '../../controllers/purchase.controller';
import { auth, adminOnly } from '../../middleware/auth.middleware';
import {
  vehicleCreateValidator,
  vehicleUpdateValidator,
  purchaseValidator,
  restockValidator,
} from '../../validators/vehicle.validator';
import { validateRequest } from '../../middleware/validation.middleware';

const router = Router();
const vehicleController = new VehicleController();
const purchaseController = new PurchaseController();

// Protected routes (User/Admin)
router.get('/', auth, vehicleController.getAll);
router.get('/search', auth, vehicleController.search);
router.get('/:id', auth, vehicleController.getById);

// Protected routes (User/Admin)
router.post('/:id/purchase', auth, purchaseValidator, validateRequest, purchaseController.purchase);

// Admin-only routes
router.post('/', auth, adminOnly, vehicleCreateValidator, validateRequest, vehicleController.create);
router.put('/:id', auth, adminOnly, vehicleUpdateValidator, validateRequest, vehicleController.update);
router.delete('/:id', auth, adminOnly, vehicleController.delete);
router.post('/:id/restock', auth, adminOnly, restockValidator, validateRequest, purchaseController.restock);

export default router;
