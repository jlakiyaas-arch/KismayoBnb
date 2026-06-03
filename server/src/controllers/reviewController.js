import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

export const getPropertyReviews = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ property: propertyId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ property: propertyId }),
  ]);

  res.status(200).json({
    success: true,
    data: reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const { property: propertyId, rating, comment } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) throw new ApiError(404, 'Property not found');

  const eligibleBooking = await Booking.findOne({
    guest: req.user._id,
    property: propertyId,
    status: { $in: ['confirmed', 'completed'] },
    checkOut: { $lte: new Date() },
  });

  if (!eligibleBooking) {
    throw new ApiError(
      403,
      'You can only review properties after a completed stay (check-out date must have passed)'
    );
  }

  const existing = await Review.findOne({ user: req.user._id, property: propertyId });
  if (existing) {
    throw new ApiError(409, 'You have already reviewed this property');
  }

  const review = await Review.create({
    user: req.user._id,
    property: propertyId,
    rating,
    comment,
  });

  await review.populate('user', 'name avatar');

  res.status(201).json({
    success: true,
    message: 'Review submitted',
    data: { review },
  });
});

export const updateReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  if (review.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to edit this review');
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('user', 'name avatar');

  res.status(200).json({
    success: true,
    message: 'Review updated',
    data: { review },
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  if (review.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to delete this review');
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Review deleted',
  });
});
