import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import Wishlist from '../models/Wishlist.js';
import Property from '../models/Property.js';

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, properties: [] });
  }
  return wishlist;
};

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'properties',
    populate: { path: 'host', select: 'name avatar' },
  });

  res.status(200).json({
    success: true,
    data: wishlist?.properties || [],
  });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const property = await Property.findById(propertyId);
  if (!property) throw new ApiError(404, 'Property not found');

  const wishlist = await getOrCreateWishlist(req.user._id);

  if (wishlist.properties.some((id) => id.toString() === propertyId)) {
    throw new ApiError(409, 'Property already in wishlist');
  }

  wishlist.properties.push(propertyId);
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Added to wishlist',
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const wishlist = await getOrCreateWishlist(req.user._id);
  wishlist.properties = wishlist.properties.filter((id) => id.toString() !== propertyId);
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Removed from wishlist',
  });
});

export const checkWishlist = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  const isSaved = wishlist?.properties.some((id) => id.toString() === propertyId) || false;

  res.status(200).json({
    success: true,
    data: { isSaved },
  });
});
