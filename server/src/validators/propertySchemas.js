import { z } from 'zod';

const propertyTypeEnum = z.enum(['apartment', 'house', 'villa', 'cabin', 'hotel', 'other']);

const locationSchema = z.object({
  address: z.string().trim().optional(),
  city: z.string().min(2, 'City is required').trim(),
  country: z.string().min(2, 'Country is required').trim(),
  coordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
});

const propertyBodySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120).trim(),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000)
    .trim(),
  price: z.number().positive('Price must be greater than 0'),
  location: locationSchema,
  amenities: z.array(z.string().trim()).default([]),
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed'),
  propertyType: propertyTypeEnum.default('apartment'),
  maxGuests: z.number().int().positive('Max guests must be at least 1'),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  availability: z
    .object({
      blockedDates: z.array(z.coerce.date()).optional(),
    })
    .optional(),
});

export const createPropertySchema = propertyBodySchema;

export const updatePropertySchema = propertyBodySchema.partial();

export const propertyQuerySchema = z
  .object({
    location: z.string().trim().optional(),
    checkIn: z.coerce.date().optional(),
    checkOut: z.coerce.date().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    guests: z.coerce.number().int().positive().optional(),
    propertyType: propertyTypeEnum.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(12),
    sort: z
      .enum(['createdAt', '-createdAt', 'price', '-price', 'averageRating', '-averageRating'])
      .default('-createdAt'),
  })
  .refine(
    (data) => {
      if (data.checkIn && data.checkOut) return data.checkOut > data.checkIn;
      if (data.checkIn || data.checkOut) return false;
      return true;
    },
    { message: 'checkOut must be after checkIn', path: ['checkOut'] }
  )
  .refine(
    (data) => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.maxPrice >= data.minPrice;
      }
      return true;
    },
    { message: 'maxPrice must be greater than or equal to minPrice', path: ['maxPrice'] }
  );

export const propertyIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid property ID'),
});
