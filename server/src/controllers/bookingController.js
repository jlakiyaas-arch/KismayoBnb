import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import {
  calculateNights,
  normalizeDate,
  buildOverlapFilter,
} from '../utils/bookingHelpers.js';

export const createBooking = asyncHandler(async (req, res) => {
  const { property: propertyId, checkIn, checkOut } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) throw new ApiError(404, 'Property not found');

  if (property.host.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot book your own property');
  }

  const checkInDate = normalizeDate(checkIn);
  const checkOutDate = normalizeDate(checkOut);
  const nights = calculateNights(checkInDate, checkOutDate);

  if (nights < 1) throw new ApiError(400, 'Stay must be at least 1 night');

  const overlap = await Booking.findOne(
    buildOverlapFilter(propertyId, checkInDate, checkOutDate)
  );
  if (overlap) {
    throw new ApiError(409, 'Property is not available for the selected dates');
  }

  const totalPrice = nights * property.price;

  const booking = await Booking.create({
    guest: req.user._id,
    property: propertyId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    nights,
    totalPrice,
    status: 'confirmed',
  });

  await booking.populate([
    { path: 'property', select: 'title images price location' },
    { path: 'guest', select: 'name email' },
  ]);

  res.status(201).json({
    success: true,
    message: 'Booking confirmed',
    data: { booking },
  });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ guest: req.user._id })
    .populate('property', 'title images price location propertyType')
    .sort({ checkIn: -1 });

  res.status(200).json({
    success: true,
    data: bookings,
  });
});

export const getHostBookings = asyncHandler(async (req, res) => {
  const hostProperties = await Property.find({ host: req.user._id }).select('_id');
  const propertyIds = hostProperties.map((p) => p._id);

  const bookings = await Booking.find({ property: { $in: propertyIds } })
    .populate('property', 'title images location')
    .populate('guest', 'name email avatar')
    .sort({ checkIn: -1 });

  res.status(200).json({
    success: true,
    data: bookings,
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('property')
    .populate('guest', 'name email');

  if (!booking) throw new ApiError(404, 'Booking not found');

  const isGuest = booking.guest._id.toString() === req.user._id.toString();
  const propertyDoc = await Property.findById(booking.property._id || booking.property);
  const isHost = propertyDoc?.host?.toString() === req.user._id.toString();

  if (!isGuest && !isHost) {
    throw new ApiError(403, 'Not authorized to view this booking');
  }

  res.status(200).json({
    success: true,
    data: { booking },
  });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) throw new ApiError(404, 'Booking not found');

  if (booking.guest.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to cancel this booking');
  }

  if (booking.status === 'cancelled') {
    throw new ApiError(400, 'Booking is already cancelled');
  }

  booking.status = 'cancelled';
  await booking.save();

  await booking.populate('property', 'title images');

  res.status(200).json({
    success: true,
    message: 'Booking cancelled',
    data: { booking },
  });
});

export const checkAvailability = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const checkIn = normalizeDate(req.query.checkIn);
  const checkOut = normalizeDate(req.query.checkOut);

  if (!checkIn || !checkOut || checkOut <= checkIn) {
    throw new ApiError(400, 'Valid checkIn and checkOut query params required');
  }

  const overlap = await Booking.findOne(buildOverlapFilter(propertyId, checkIn, checkOut));

  res.status(200).json({
    success: true,
    data: { available: !overlap },
  });
});
