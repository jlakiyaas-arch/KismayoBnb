import { z } from 'zod';

export const createBookingSchema = z
  .object({
    property: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid property ID'),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: 'checkOut must be after checkIn',
    path: ['checkOut'],
  })
  .refine((data) => normalizeDate(data.checkIn) >= normalizeDate(new Date()), {
    message: 'checkIn cannot be in the past',
    path: ['checkIn'],
  });

function normalizeDate(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const bookingIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID'),
});
