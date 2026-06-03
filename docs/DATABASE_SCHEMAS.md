# MongoDB Schemas (Mongoose)

---

## User

```javascript
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['guest', 'host'],
      default: 'guest',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};
```

**Indexes:** `email` (unique, automatic)

---

## Property

```javascript
const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    location: {
      address: String,
      city: { type: String, required: true, index: true },
      country: { type: String, required: true },
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
      type: [{ type: String, match: /^https?:\/\// }],
      validate: [arr => arr.length >= 1, 'At least one image required'],
    },
    propertyType: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'cabin', 'hotel', 'other'],
      default: 'apartment',
    },
    maxGuests: { type: Number, required: true, min: 1 },
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
propertySchema.index({ 'location.city': 'text', title: 'text' });
```

---

## Booking

```javascript
const bookingSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 });
bookingSchema.pre('validate', function (next) {
  if (this.checkOut <= this.checkIn) {
    next(new Error('checkOut must be after checkIn'));
  } else {
    next();
  }
});
```

---

## Review

```javascript
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
  },
  { timestamps: true }
);

// One review per user per property
reviewSchema.index({ user: 1, property: 1 }, { unique: true });
```

**Post-save hook:** Recalculate `property.averageRating` and `reviewCount`.

---

## Wishlist

**Option A — Separate collection (recommended for clarity):**

```javascript
const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
  },
  { timestamps: true }
);
```

**Option B — Embed on User:** `savedProperties: [{ type: ObjectId, ref: 'Property' }]`

---

## Entity Relationship Diagram

```
┌──────────┐       hosts        ┌───────────┐
│   User   │─────────────────────▶│ Property  │
└────┬─────┘                      └─────┬─────┘
     │                                  │
     │ guest                            │ referenced by
     ▼                                  ▼
┌──────────┐                      ┌───────────┐
│ Booking  │◀─────────────────────│           │
└──────────┘                      │  Review   │
                                  └───────────┘
     │
     │ user
     ▼
┌──────────┐
│ Wishlist │─── properties[] ───▶ Property
└──────────┘
```

---

## Zod Validation Examples (Server)

### Register

```javascript
export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Za-z0-9]/),
  role: z.enum(['guest', 'host']).optional().default('guest'),
});
```

### Create Property

```javascript
export const createPropertySchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(20).max(2000),
  price: z.number().positive(),
  location: z.object({
    address: z.string().optional(),
    city: z.string().min(2),
    country: z.string().min(2),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  }),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url()).min(1).max(10),
  propertyType: z.enum(['apartment', 'house', 'villa', 'cabin', 'hotel', 'other']),
  maxGuests: z.number().int().positive(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
});
```

### Create Booking

```javascript
export const createBookingSchema = z.object({
  property: z.string().regex(/^[0-9a-fA-F]{24}$/),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
}).refine(data => data.checkOut > data.checkIn, {
  message: 'checkOut must be after checkIn',
  path: ['checkOut'],
});
```

---

## Seed Data Tips

- Create 1 host, 2 guests
- 10–15 properties across 3 cities
- Use Unsplash URLs: `https://images.unsplash.com/photo-{id}?w=800`
- 5–8 bookings with mixed statuses for dashboard demos
