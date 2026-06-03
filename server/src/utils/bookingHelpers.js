export const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const calculateNights = (checkIn, checkOut) => {
  const start = normalizeDate(checkIn);
  const end = normalizeDate(checkOut);
  const ms = end - start;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

export const datesOverlap = (checkInA, checkOutA, checkInB, checkOutB) =>
  checkInA < checkOutB && checkOutA > checkInB;

export const buildOverlapFilter = (propertyId, checkIn, checkOut) => ({
  property: propertyId,
  status: { $nin: ['cancelled'] },
  checkIn: { $lt: checkOut },
  checkOut: { $gt: checkIn },
});
