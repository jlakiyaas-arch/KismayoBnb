# KISBNB Client — Phases 3–5

## Setup

```bash
npm install
npm run dev
```

Runs at [http://localhost:5173](http://localhost:5173). API requests proxy to `http://localhost:5000` or use `VITE_API_URL`.

**Requires backend running** with seeded properties:

```bash
cd ../server
npm run dev
npm run seed
```

## Features

- Home hero search + featured listings
- Properties page with debounced filters (URL-synced)
- Property detail page (booking widget placeholder)
- Login / register (Redux + JWT + Zod + React Hook Form)
- Protected routes (guest / host)
- Loading skeletons + toast notifications
- **Host:** create, edit, delete properties (Unsplash URLs, amenities)
- Profile page (update name & avatar)
- **Bookings:** reserve stays, view/cancel trips
- **Reviews:** rate after check-out
- **Wishlist:** save/remove favorites
- **Host:** reservations + earnings dashboard

## Demo logins

- Host: `host@demo.com` / `Demo1234!`
- Guest: `guest@demo.com` / `Demo1234!`
