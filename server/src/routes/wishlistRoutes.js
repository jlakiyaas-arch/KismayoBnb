import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { ApiError } from '../utils/ApiError.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from '../controllers/wishlistController.js';

const router = Router();

const propertyIdParam = (req, res, next) => {
  const { propertyId } = req.params;
  if (!/^[0-9a-fA-F]{24}$/.test(propertyId)) {
    return next(new ApiError(400, 'Invalid property ID'));
  }
  next();
};

router.use(protect);

router.get('/', getWishlist);
router.get('/check/:propertyId', propertyIdParam, checkWishlist);
router.post('/:propertyId', propertyIdParam, addToWishlist);
router.delete('/:propertyId', propertyIdParam, removeFromWishlist);

export default router;
