# KISBNB API — Phases 1–5

## Setup

1. Copy environment file: `cp .env.example .env`
2. Set `MONGO_URI` to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB
3. Install and run:

```bash
npm install
npm run dev
```

## Seed demo users

```bash
npm run seed
```

| Email | Password | Role |
|-------|----------|------|
| host@demo.com | Demo1234! | host |
| guest@demo.com | Demo1234! | guest |

## API endpoints

### Health

```
GET /api/health
```

### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Aisha Khan",
  "email": "you@example.com",
  "password": "Secure123",
  "role": "guest"
}
```

### Login

```
POST /api/auth/login

{
  "email": "you@example.com",
  "password": "Secure123"
}
```

Response includes `data.token` — use as `Authorization: Bearer <token>`.

### Profile (protected)

```
GET /api/auth/me
PUT /api/auth/me
POST /api/auth/logout
```

### Host role test

```
GET /api/auth/host-check
```

Returns `403` for guests, `200` for hosts.

## Properties (Phase 2)

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/properties` | Public (filters + pagination) |
| GET | `/api/properties/:id` | Public |
| GET | `/api/properties/host/me` | Host |
| POST | `/api/properties` | Host |
| PUT | `/api/properties/:id` | Host (owner) |
| DELETE | `/api/properties/:id` | Host (owner) |

**Query filters:** `location`, `checkIn`, `checkOut`, `minPrice`, `maxPrice`, `guests`, `propertyType`, `page`, `limit`, `sort`

Example:

```
GET /api/properties?location=Paris&minPrice=50&maxPrice=200&guests=2&page=1&limit=12
```

**Create property** (host token):

```
POST /api/properties
{
  "title": "Sunny Apartment",
  "description": "A beautiful place with at least twenty characters...",
  "price": 99,
  "location": { "city": "London", "country": "UK" },
  "amenities": ["wifi", "kitchen"],
  "images": ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
  "propertyType": "apartment",
  "maxGuests": 3
}
```

## Bookings, Reviews, Wishlist (Phase 5)

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/bookings` | Guest |
| GET | `/api/bookings/my` | Guest |
| GET | `/api/bookings/host` | Host |
| PATCH | `/api/bookings/:id/cancel` | Guest |
| GET | `/api/bookings/property/:propertyId/availability` | Public |
| GET | `/api/reviews/property/:propertyId` | Public |
| POST | `/api/reviews` | Guest (after stay) |
| GET | `/api/wishlist` | User |
| POST/DELETE | `/api/wishlist/:propertyId` | User |
| GET | `/api/dashboard/host/stats` | Host |

## Project structure

```
src/
├── config/db.js
├── controllers/authController.js
├── middleware/ (auth, authorize, validate, errorHandler)
├── models/User.js
├── routes/authRoutes.js
├── validators/authSchemas.js
├── utils/
├── app.js
└── server.js
```
