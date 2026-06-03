# System Architecture — KISBNB

## 1. High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React + Vite)                           │
│  Pages │ Components │ Redux Toolkit │ Axios │ React Hook Form + Zod    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ HTTPS (JSON)
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    API (Express on Render / Railway)                    │
│  Routes → Controllers → Services → Mongoose Models                      │
│  Middleware: auth, roles, validate (Zod), errorHandler, upload           │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
      ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
      │ MongoDB      │  │ JWT (stateless)│  │ Unsplash URLs│
      │ Atlas        │  │ httpOnly cookie│  │ (image links)│
      └──────────────┘  └──────────────┘  └──────────────┘
```

## 2. Architectural Principles

| Principle | Implementation |
|-----------|----------------|
| Separation of concerns | Routes → controllers → models; thin routes |
| Validation at boundary | Zod on request body/query (server + client) |
| Fail safely | Global error middleware; consistent `{ success, message, data }` |
| Stateless auth | JWT in `Authorization: Bearer` or httpOnly cookie |
| Scalable queries | Indexes on `location`, `host`, `guest`, `property`, dates |
| UX performance | Pagination, debounced search, skeleton loaders |

## 3. Request Lifecycle

```
HTTP Request
    → CORS + body parser
    → Route matcher
    → protect (JWT verify) [optional]
    → authorize('host' | 'guest') [optional]
    → validate(schema) [Zod]
    → Controller (async)
    → Response OR next(error)
    → errorHandler (maps Mongoose/JWT/Zod errors)
```

## 4. Authentication Flow

```
Register/Login → bcrypt hash/compare → sign JWT { id, role }
    → Client stores token (memory + localStorage OR httpOnly cookie)
    → Axios interceptor attaches Bearer token
    → Protected routes: 401 → redirect /login
    → Role routes: 403 → forbidden page
```

## 5. Booking & Availability Logic

```
Guest selects checkIn, checkOut
    → API validates: checkOut > checkIn, dates in future
    → Query overlapping bookings for property (status !== 'cancelled')
    → If overlap → 409 Conflict
    → Else: nights = diff days, totalPrice = nights × pricePerNight
    → Create booking (status: 'pending' | 'confirmed')
```

**Overlap query (conceptual):**

```javascript
{
  property: propertyId,
  status: { $ne: 'cancelled' },
  checkIn: { $lt: requestedCheckOut },
  checkOut: { $gt: requestedCheckIn }
}
```

## 6. Search & Filter Pipeline

```
Query params: location, checkIn, checkOut, minPrice, maxPrice,
              guests, propertyType, page, limit, sort
    → Build MongoDB filter object
    → Text/regex on location.city or location.country
    → Price range: { price: { $gte, $lte } }
    → guests: { maxGuests: { $gte: guests } }
    → Availability: exclude properties with conflicting bookings
    → .skip().limit() for pagination
    → Aggregate avg rating (lookup reviews) for sort
```

## 7. State Management (Frontend)

| Concern | Tool |
|---------|------|
| Auth user, token | Redux Toolkit `authSlice` + persist |
| UI toasts | Redux or react-hot-toast |
| Server data (listings, bookings) | RTK Query **or** Context + useEffect |
| Forms | React Hook Form + Zod resolver |

**Recommended:** Redux Toolkit + RTK Query for API caching and invalidation after mutations.

## 8. Folder Structure

### Backend (`server/`)

```
server/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   └── wishlistController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   └── Wishlist.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── wishlistRoutes.js
│   ├── validators/
│   │   ├── authSchemas.js
│   │   ├── propertySchemas.js
│   │   └── bookingSchemas.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   └── generateToken.js
│   ├── app.js
│   └── server.js
├── .env.example
├── Dockerfile
└── package.json
```

### Frontend (`client/`)

```
client/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/       # Navbar, Footer, Sidebar
│   │   ├── ui/           # Button, Input, Modal, Skeleton
│   │   ├── property/     # PropertyCard, PropertyGrid, FilterBar
│   │   ├── booking/      # DatePicker, BookingSummary
│   │   └── review/       # ReviewList, StarRating
│   ├── pages/
│   ├── hooks/            # useDebounce, useAuth
│   ├── store/            # Redux slices + api
│   ├── services/api/     # axios instance
│   ├── utils/            # formatPrice, formatDate
│   ├── App.jsx
│   └── main.jsx
├── .env.example
└── package.json
```

## 9. API Response Contract

**Success:**

```json
{
  "success": true,
  "message": "Properties fetched",
  "data": { },
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "pages": 4
  }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "path": "email", "message": "Invalid email" }]
}
```

## 10. Security Checklist

- [ ] Passwords hashed with bcrypt (salt rounds ≥ 10)
- [ ] JWT secret in environment variables only
- [ ] Rate limiting on `/api/auth/login` (express-rate-limit)
- [ ] Helmet for HTTP headers
- [ ] CORS restricted to frontend origin in production
- [ ] Host can only edit/delete own properties (`property.host === req.user.id`)
- [ ] Guests can only cancel own bookings
- [ ] Input sanitized via Zod (no raw `$where` from user input)

## 11. Docker Architecture

```
docker-compose.yml
├── api (Node 20, port 5000)
├── mongo (optional local dev; prod uses Atlas)
└── client (optional; prod uses Vercel)
```

Production: API container on Render/Railway; DB on Atlas; static client on Vercel.

## 12. External Integrations

| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Primary database |
| Unsplash | Image URLs stored in `property.images[]` (no file upload server) |
| Vercel | Frontend hosting + env `VITE_API_URL` |
| Render / Railway | Backend hosting + env `MONGO_URI`, `JWT_SECRET` |
