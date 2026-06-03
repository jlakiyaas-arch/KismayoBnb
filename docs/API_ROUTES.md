# API Routes Reference

**Base URL (dev):** `http://localhost:5000/api`  
**Base URL (prod):** `https://your-api.onrender.com/api`

All protected routes require header:

```
Authorization: Bearer <jwt_token>
```

---

## Health

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/health` | Public | API status |

**Response 200:**

```json
{ "success": true, "message": "API is running" }
```

---

## Authentication (`/auth`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Login, returns JWT |
| GET | `/auth/me` | User | Current user profile |
| PUT | `/auth/me` | User | Update name, avatar |
| POST | `/auth/logout` | User | Optional server blacklist; client clears token |

### POST `/auth/register`

**Body:**

```json
{
  "name": "Aisha Khan",
  "email": "aisha@example.com",
  "password": "SecurePass123",
  "role": "guest"
}
```

`role`: `"guest"` | `"host"` (default `"guest"`)

**Response 201:**

```json
{
  "success": true,
  "data": {
    "user": { "_id", "name", "email", "role", "avatar" },
    "token": "eyJhbG..."
  }
}
```

### POST `/auth/login`

**Body:**

```json
{ "email": "aisha@example.com", "password": "SecurePass123" }
```

---

## Properties (`/properties`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/properties` | Public | List with search & pagination |
| GET | `/properties/:id` | Public | Single property + avg rating |
| POST | `/properties` | Host | Create listing |
| PUT | `/properties/:id` | Host (owner) | Update listing |
| DELETE | `/properties/:id` | Host (owner) | Delete listing |
| GET | `/properties/host/me` | Host | Host's own listings |

### GET `/properties` — Query parameters

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| location | string | `Paris` | City or country (regex) |
| checkIn | ISO date | `2026-07-01` | Availability filter |
| checkOut | ISO date | `2026-07-05` | Availability filter |
| minPrice | number | `50` | Min price per night |
| maxPrice | number | `300` | Max price per night |
| guests | number | `4` | `maxGuests >= guests` |
| propertyType | string | `apartment` | apartment, house, villa, etc. |
| page | number | `1` | Page number |
| limit | number | `12` | Items per page |
| sort | string | `-createdAt` | Mongoose sort string |

### POST `/properties`

**Body:**

```json
{
  "title": "Cozy Studio in Paris",
  "description": "Bright studio near the metro...",
  "price": 89,
  "location": {
    "address": "12 Rue de Rivoli",
    "city": "Paris",
    "country": "France",
    "coordinates": { "lat": 48.8566, "lng": 2.3522 }
  },
  "amenities": ["wifi", "kitchen", "washer"],
  "images": [
    "https://images.unsplash.com/photo-...",
    "https://images.unsplash.com/photo-..."
  ],
  "propertyType": "apartment",
  "maxGuests": 2,
  "bedrooms": 1,
  "bathrooms": 1,
  "availability": {
    "blockedDates": []
  }
}
```

---

## Bookings (`/bookings`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/bookings` | Guest | Create booking |
| GET | `/bookings/my` | Guest | My bookings |
| GET | `/bookings/host` | Host | Reservations on my properties |
| GET | `/bookings/:id` | Guest/Host | Single booking detail |
| PATCH | `/bookings/:id/cancel` | Guest (owner) | Cancel booking |
| GET | `/bookings/property/:propertyId/availability` | Public | Check date conflicts |

### POST `/bookings`

**Body:**

```json
{
  "property": "507f1f77bcf86cd799439011",
  "checkIn": "2026-08-01",
  "checkOut": "2026-08-05"
}
```

Server computes `totalPrice` and sets `status: "confirmed"` (or `"pending"`).

**Response 201:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "guest": "...",
    "property": { "title", "images", "price" },
    "checkIn": "2026-08-01T00:00:00.000Z",
    "checkOut": "2026-08-05T00:00:00.000Z",
    "nights": 4,
    "totalPrice": 356,
    "status": "confirmed"
  }
}
```

**Errors:**

- `409` — Dates overlap existing booking
- `400` — Invalid date range

---

## Reviews (`/reviews`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/reviews/property/:propertyId` | Public | Reviews for property (paginated) |
| POST | `/reviews` | Guest | Create review (must have completed stay) |
| PUT | `/reviews/:id` | User (owner) | Edit own review |
| DELETE | `/reviews/:id` | User (owner) | Delete review |

### POST `/reviews`

**Body:**

```json
{
  "property": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Amazing stay, would book again!"
}
```

`rating`: 1–5

---

## Wishlist (`/wishlist`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/wishlist` | User | All saved properties (populated) |
| POST | `/wishlist/:propertyId` | User | Add to wishlist |
| DELETE | `/wishlist/:propertyId` | User | Remove from wishlist |
| GET | `/wishlist/check/:propertyId` | User | `{ isSaved: true/false }` |

---

## Host Dashboard (`/dashboard`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/dashboard/host/stats` | Host | Properties count, reservations, earnings |

**Response:**

```json
{
  "success": true,
  "data": {
    "totalProperties": 5,
    "activeBookings": 12,
    "totalEarnings": 4520,
    "monthlyEarnings": [{ "month": "2026-05", "amount": 890 }]
  }
}
```

---

## HTTP Status Codes

| Code | Usage |
|------|--------|
| 200 | OK |
| 201 | Created |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Forbidden (wrong role or not owner) |
| 404 | Not found |
| 409 | Conflict (booking overlap, duplicate review) |
| 500 | Server error |

---

## Swagger (optional)

Install:

```bash
npm install swagger-ui-express swagger-jsdoc
```

Mount at `GET /api/docs` in `app.js` with JSDoc comments on route files.

---

## Postman Collection Structure

```
KISBNB API
├── Auth
│   ├── Register Guest
│   ├── Register Host
│   └── Login
├── Properties
│   ├── List (with filters)
│   ├── Create
│   └── Get by ID
├── Bookings
│   ├── Create
│   └── Cancel
├── Reviews
└── Wishlist
```

Set collection variable `{{baseUrl}}` and `{{token}}` from login response.
