import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
  propertyReviewsQuerySchema,
} from '../validators/reviewSchemas.js';
import {
  getPropertyReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';

const router = Router();

router.get(
  '/property/:propertyId',
  validate(propertyReviewsQuerySchema, 'query'),
  getPropertyReviews
);
router.post('/', protect, authorize('guest'), validate(createReviewSchema), createReview);
router.put(
  '/:id',
  protect,
  validate(reviewIdSchema, 'params'),
  validate(updateReviewSchema),
  updateReview
);
router.delete(
  '/:id',
  protect,
  validate(reviewIdSchema, 'params'),
  deleteReview
);

export default router;
