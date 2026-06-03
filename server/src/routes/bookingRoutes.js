import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createBookingSchema,
  bookingIdSchema,
} from '../validators/bookingSchemas.js';
import {
  createBooking,
  getMyBookings,
  getHostBookings,
  getBookingById,
  cancelBooking,
  checkAvailability,
} from '../controllers/bookingController.js';

const router = Router();

router.post('/', protect, authorize('guest'), validate(createBookingSchema), createBooking);
router.get('/my', protect, authorize('guest'), getMyBookings);
router.get('/host', protect, authorize('host'), getHostBookings);
router.get(
  '/property/:propertyId/availability',
  checkAvailability
);
router.get('/:id', protect, validate(bookingIdSchema, 'params'), getBookingById);
router.patch(
  '/:id/cancel',
  protect,
  authorize('guest'),
  validate(bookingIdSchema, 'params'),
  cancelBooking
);

export default router;
