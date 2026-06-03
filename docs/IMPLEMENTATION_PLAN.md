# Step-by-Step Implementation Plan

Estimated timeline: **4–6 weeks** (bootcamp pace). Adjust per sprint length.

---

## Phase 1 — Backend Setup, MongoDB & Auth (Week 1)

### Day 1–2: Project bootstrap

- [ ] `npm init` in `server/`, install: express, mongoose, dotenv, cors, helmet, bcryptjs, jsonwebtoken, zod, express-async-handler
- [ ] Create `src/app.js`, `src/server.js`, connect MongoDB Atlas
- [ ] Add `asyncHandler`, `ApiError`, global `errorHandler`
- [ ] Health check: `GET /api/health`

### Day 3–4: User model & auth

- [ ] `User` model (name, email, password, role, avatar)
- [ ] Zod schemas: register, login
- [ ] `POST /api/auth/register`, `POST /api/auth/login`
- [ ] `generateToken`, `protect` middleware
- [ ] `GET /api/auth/me`, `POST /api/auth/logout` (client clears token)

### Day 5: Role middleware

- [ ] `authorize('host')`, `authorize('guest')`
- [ ] Seed script or Postman collection for test users

**Deliverable:** Auth works in Postman/Thunder Client; JWT returned on login.

---

## Phase 2 — Property CRUD (Week 2)

### Day 1–2: Property model

- [ ] `Property` model with location subdocument, amenities array, images array
- [ ] Indexes: `host`, `location.city`, `price`, `propertyType`

### Day 3–4: Host endpoints

- [ ] `POST /api/properties` (host only)
- [ ] `GET /api/properties` (public, with filters + pagination)
- [ ] `GET /api/properties/:id`
- [ ] `PUT /api/properties/:id`, `DELETE /api/properties/:id` (owner only)
- [ ] Unsplash: accept `images: string[]` URLs in body (validate URL with Zod)

### Day 5: Search foundation

- [ ] Query filters: location, minPrice, maxPrice, guests, propertyType
- [ ] Pagination: `page`, `limit` (default 12)

**Deliverable:** CRUD + list with filters via API client.

---

## Phase 3 — Frontend UI Shell (Week 2–3)

### Day 1: Vite + React setup

- [ ] `npm create vite@latest client -- --template react`
- [ ] Tailwind CSS, React Router, Axios, React Hook Form, Zod, Redux Toolkit

### Day 2–3: Layout & routing

- [ ] `Navbar`, `Footer`, `ProtectedRoute`, `HostRoute`
- [ ] Pages: Home, Login, Register, NotFound
- [ ] Axios instance + auth interceptor

### Day 4–5: Property UI (mock or API)

- [ ] `PropertyCard`, `PropertyGrid`, `FilterBar` (debounced location)
- [ ] `PropertyDetailPage` skeleton
- [ ] Loading skeletons, toast notifications (react-hot-toast)

**Deliverable:** Navigable UI with placeholder or live listing data.

---

## Phase 4 — Connect Frontend to Backend (Week 3)

### Day 1–2: Auth flow

- [ ] Register/Login forms with RHF + Zod
- [ ] Redux `authSlice`: setUser, logout, token
- [ ] Persist token; redirect after login by role

### Day 3–4: Properties

- [ ] Home: fetch properties with query params from URL (`useSearchParams`)
- [ ] Host: Create/Edit property forms
- [ ] Image URL inputs (Unsplash links) with preview

### Day 5: Profile & dashboards shell

- [ ] Guest dashboard route
- [ ] Host dashboard route

**Deliverable:** End-to-end auth + property list/create/edit.

---

## Phase 5 — Booking, Reviews, Wishlist (Week 4)

### Day 1–2: Booking API

- [ ] `Booking` model, overlap validation
- [ ] `POST /api/bookings`, `GET /api/bookings/my`, `PATCH /api/bookings/:id/cancel`
- [ ] Host: `GET /api/bookings/host` (reservations on their properties)

### Day 3: Booking UI

- [ ] Date range picker on property detail
- [ ] Price calculator (nights × price)
- [ ] My Bookings page, cancel action

### Day 4: Reviews

- [ ] `Review` model; one review per user per property (unique compound index)
- [ ] `POST /api/reviews`, `GET /api/properties/:id/reviews`
- [ ] Average rating on property (aggregation or virtual)

### Day 5: Wishlist

- [ ] `Wishlist` model or embedded array on User
- [ ] Toggle wishlist endpoints
- [ ] Wishlist page

**Deliverable:** Full booking + review + wishlist flows.

---

## Phase 6 — Dashboards, Polish & Deploy (Week 5–6)

### Day 1–2: Dashboards

- [ ] Guest: bookings + history tabs
- [ ] Host: properties table, reservations, earnings sum (aggregate confirmed bookings)

### Day 3: Advanced features

- [ ] Debounced search hook
- [ ] API docs: Swagger (`swagger-ui-express`) or `docs/API_ROUTES.md` + Postman collection
- [ ] Docker: `Dockerfile` + `docker-compose.yml`

### Day 4–5: Deployment

- [ ] MongoDB Atlas IP whitelist + connection string
- [ ] Deploy API to Render/Railway
- [ ] Deploy client to Vercel with `VITE_API_URL`
- [ ] Smoke test production URLs

### Day 6: Final QA

- [ ] Cross-browser check
- [ ] Mobile responsive (Tailwind breakpoints)
- [ ] README demo video / screenshots for instructors

**Deliverable:** Live URLs + graduation demo ready.

---

## Daily Development Checklist

1. Pull latest, create feature branch `feature/phase-X-description`
2. Implement smallest vertical slice (API + one UI screen)
3. Test in Postman and browser
4. Commit with conventional message: `feat(auth): add JWT protect middleware`
5. Update progress report (see `PROGRESS_REPORTS.md`)

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Date/timezone bugs | Store dates as UTC midnight `Date`; display with `date-fns` |
| Double booking | Server-side overlap check in transaction or unique constraint |
| CORS errors | Set `CLIENT_URL` in API env; mirror in Vercel |
| Large images | Use Unsplash URLs only; validate with Zod `.url()` |
| Scope creep | Ship Phase 1–5 core first; polish in Phase 6 |

---

## Definition of Done (Graduation)

- [ ] Register, login, logout, role-based routes
- [ ] Host CRUD properties with images & amenities
- [ ] Search/filter with pagination
- [ ] Book, view total, cancel
- [ ] Guest & host dashboards
- [ ] Reviews with average rating
- [ ] Wishlist
- [ ] Zod validation (client + server)
- [ ] Global error middleware
- [ ] Deployed frontend + backend + Atlas
- [ ] README + API documentation
