import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    location: {
      address: { type: String, trim: true },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        index: true,
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amenities: [{ type: String, trim: true }],
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: 'At least one image is required',
      },
    },
    propertyType: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'cabin', 'hotel', 'other'],
      default: 'apartment',
    },
    maxGuests: {
      type: Number,
      required: [true, 'Max guests is required'],
      min: [1, 'Must allow at least 1 guest'],
    },
    bedrooms: { type: Number, default: 1, min: 0 },
    bathrooms: { type: Number, default: 1, min: 0 },
    availability: {
      blockedDates: [{ type: Date }],
    },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

propertySchema.index({ price: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ title: 'text', 'location.city': 'text', 'location.country': 'text' });

const Property = mongoose.model('Property', propertySchema);

export default Property;
