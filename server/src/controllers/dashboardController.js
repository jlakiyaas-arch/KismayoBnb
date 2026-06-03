import { asyncHandler } from '../utils/asyncHandler.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';

export const getHostStats = asyncHandler(async (req, res) => {
  const properties = await Property.find({ host: req.user._id }).select('_id');
  const propertyIds = properties.map((p) => p._id);

  const [activeBookings, earningsAgg] = await Promise.all([
    Booking.countDocuments({
      property: { $in: propertyIds },
      status: 'confirmed',
      checkOut: { $gte: new Date() },
    }),
    Booking.aggregate([
      {
        $match: {
          property: { $in: propertyIds },
          status: { $in: ['confirmed', 'completed'] },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalProperties: properties.length,
      activeBookings,
      totalEarnings: earningsAgg[0]?.total || 0,
    },
  });
});
