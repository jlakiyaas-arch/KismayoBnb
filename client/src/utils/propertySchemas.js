import { z } from 'zod';

export const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'cabin', 'hotel', 'other'];

export const AMENITY_OPTIONS = [
  'wifi',
  'kitchen',
  'washer',
  'dryer',
  'air conditioning',
  'heating',
  'parking',
  'pool',
  'workspace',
  'tv',
  'breakfast',
  'fireplace',
];

export const propertyFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  price: z.coerce.number().positive('Price must be greater than 0'),
  location: z.object({
    address: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    country: z.string().min(2, 'Country is required'),
  }),
  amenities: z.array(z.string()).default([]),
  images: z
    .array(z.object({ url: z.string().url('Must be a valid image URL') }))
    .min(1, 'Add at least one image URL'),
  propertyType: z.enum(['apartment', 'house', 'villa', 'cabin', 'hotel', 'other']),
  maxGuests: z.coerce.number().int().positive('At least 1 guest'),
  bedrooms: z.coerce.number().int().min(0).default(1),
  bathrooms: z.coerce.number().int().min(0).default(1),
});

export const toPropertyPayload = (data) => ({
  title: data.title.trim(),
  description: data.description.trim(),
  price: data.price,
  location: {
    address: data.location.address?.trim() || undefined,
    city: data.location.city.trim(),
    country: data.location.country.trim(),
  },
  amenities: data.amenities,
  images: data.images.map((img) => img.url.trim()),
  propertyType: data.propertyType,
  maxGuests: data.maxGuests,
  bedrooms: data.bedrooms,
  bathrooms: data.bathrooms,
});

export const propertyToFormValues = (property) => ({
  title: property.title || '',
  description: property.description || '',
  price: property.price || '',
  location: {
    address: property.location?.address || '',
    city: property.location?.city || '',
    country: property.location?.country || '',
  },
  amenities: property.amenities || [],
  images: (property.images?.length ? property.images : ['']).map((url) => ({ url })),
  propertyType: property.propertyType || 'apartment',
  maxGuests: property.maxGuests || 1,
  bedrooms: property.bedrooms ?? 1,
  bathrooms: property.bathrooms ?? 1,
});
