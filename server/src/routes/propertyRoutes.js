import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createPropertySchema,
  updatePropertySchema,
  propertyQuerySchema,
  propertyIdSchema,
} from '../validators/propertySchemas.js';
import {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';

const router = Router();

router.get('/', validate(propertyQuerySchema, 'query'), getProperties);
router.get('/featured', validate(propertyQuerySchema, 'query'), getFeaturedProperties);
router.get('/host/me', protect, authorize('host'), getMyProperties);
router.get('/:id', validate(propertyIdSchema, 'params'), getPropertyById);
router.post(
  '/',
  protect,
  authorize('host'),
  validate(createPropertySchema),
  createProperty
);
router.put(
  '/:id',
  protect,
  authorize('host'),
  validate(propertyIdSchema, 'params'),
  validate(updatePropertySchema),
  updateProperty
);
router.delete(
  '/:id',
  protect,
  authorize('host'),
  validate(propertyIdSchema, 'params'),
  deleteProperty
);

export default router;
