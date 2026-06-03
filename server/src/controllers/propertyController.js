import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import { normalizeDate } from '../utils/bookingHelpers.js';

const buildFilter = (query) => {
  const filter = {};

  if (query.location) {
    const regex = new RegExp(query.location, 'i');
    filter.$or = [
      { 'location.city': regex },
      { 'location.country': regex },
      { title: regex },
    ];
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
    if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
  }

  if (query.guests) {
    filter.maxGuests = { $gte: query.guests };
  }

  if (query.propertyType) {
    filter.propertyType = query.propertyType;
  }

  return filter;
};

const datesOverlap = (startA, endA, startB, endB) => startA < endB && endA > startB;

const filterByBlockedDates = (properties, checkIn, checkOut) => {
  if (!checkIn || !checkOut) return properties;

  return properties.filter((property) => {
    const blocked = property.availability?.blockedDates || [];
    return !blocked.some((blockedDate) => {
      const dayStart = new Date(blockedDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(blockedDate);
      dayEnd.setHours(23, 59, 59, 999);
      return datesOverlap(checkIn, checkOut, dayStart, dayEnd);
    });
  });
};

export const getProperties = asyncHandler(async (req, res) => {
  const {
    location,
    checkIn,
    checkOut,
    minPrice,
    maxPrice,
    guests,
    propertyType,
    page,
    limit,
    sort,
  } = req.query;

  const filter = buildFilter({
    location,
    minPrice,
    maxPrice,
    guests,
    propertyType,
  });

  const skip = (page - 1) * limit;
  const sortField = sort.replace('-', '');
  const sortOrder = sort.startsWith('-') ? -1 : 1;
  const sortObj = { [sortField]: sortOrder };

  let properties = await Property.find(filter)
    .populate('host', 'name avatar')
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .lean();

  if (checkIn && checkOut) {
    const checkInDate = normalizeDate(checkIn);
    const checkOutDate = normalizeDate(checkOut);
    properties = filterByBlockedDates(properties, checkInDate, checkOutDate);

    const conflictingIds = await Booking.find({
      status: { $nin: ['cancelled'] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    }).distinct('property');

    const conflictSet = new Set(conflictingIds.map(String));
    properties = properties.filter((p) => !conflictSet.has(String(p._id)));
  }

  const total = await Property.countDocuments(filter);

  res.status(200).json({
    success: true,
    message: 'Properties fetched',
    data: properties,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const getFeaturedProperties = asyncHandler(async (req, res) => {
  const {
    location,
    minPrice,
    maxPrice,
    guests,
    propertyType,
    page,
    limit,
    sort,
  } = req.query;

  const filter = buildFilter({
    location,
    minPrice,
    maxPrice,
    guests,
    propertyType,
  });

  // Hide listings that are currently booked (confirmed) between their check-in/out.
  // Cancelled bookings don't block the stay and the property comes back after checkOut passes.
  // "Currently booked" here is interpreted as "has a confirmed booking that ends in the future".
  const now = new Date();
  const activeBookedPropertyIds = await Booking.find(
    {
      status: 'confirmed',
      checkOut: { $gte: now },
    },
    { property: 1 }
  ).distinct('property');

  const skip = (page - 1) * limit;
  const sortField = sort.replace('-', '');
  const sortOrder = sort.startsWith('-') ? -1 : 1;
  const sortObj = { [sortField]: sortOrder };

  let propertiesQuery = Property.find(filter)
    .populate('host', 'name avatar')
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .lean();

  if (activeBookedPropertyIds.length) {
    propertiesQuery = Property.find(filter)
      .where('_id')
      .nin(activeBookedPropertyIds)
      .populate('host', 'name avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  const properties = await propertiesQuery;

  const totalFilter = { ...filter };
  if (activeBookedPropertyIds.length) {
    totalFilter._id = { $nin: activeBookedPropertyIds };
  }

  const total = await Property.countDocuments(totalFilter);

  res.status(200).json({
    success: true,
    message: 'Featured properties fetched',
    data: properties,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    'host',
    'name email avatar role'
  );

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  res.status(200).json({
    success: true,
    data: { property },
  });
});

export const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ host: req.user._id })
    .sort({ createdAt: -1 })
    .populate('host', 'name avatar');

  res.status(200).json({
    success: true,
    data: properties,
  });
});

export const createProperty = asyncHandler(async (req, res) => {
  const property = await Property.create({
    ...req.body,
    host: req.user._id,
  });

  await property.populate('host', 'name avatar');

  res.status(201).json({
    success: true,
    message: 'Property created',
    data: { property },
  });
});

export const updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  if (property.host.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this property');
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('host', 'name avatar');

  res.status(200).json({
    success: true,
    message: 'Property updated',
    data: { property },
  });
});

export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  if (property.host.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to delete this property');
  }

  await property.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Property deleted',
  });
});
