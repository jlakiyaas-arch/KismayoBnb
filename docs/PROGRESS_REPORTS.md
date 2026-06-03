# Progress Report Examples for Instructors

Use these templates for weekly bootcamp check-ins. Copy, fill in dates and evidence links, submit per your program's format.

---

## Report Template (Weekly)

```markdown
# KISBNB — Weekly Progress Report

**Student:** [Your Name]  
**Week:** [1–6]  
**Date:** [YYYY-MM-DD]  
**Repository:** [GitHub URL]

## Summary (2–3 sentences)
[Brief overview of what you accomplished this week and current project status.]

## Completed This Week
- [ ] Item 1
- [ ] Item 2

## In Progress
- [ ] Item with expected completion date

## Blockers / Help Needed
- [None] OR [Describe blocker and what you tried]

## Screenshots / Evidence
- Postman collection: [link or screenshot]
- UI screenshot: [link]
- Deployed URL (if applicable): [link]

## Hours Logged
| Day | Hours | Focus |
|-----|-------|-------|
| Mon | 3 | Auth API |
| Wed | 4 | Property CRUD |
| **Total** | **7** | |

## Plan for Next Week
1. ...
2. ...
```

---

## Week 1 Example — Backend & Auth

```markdown
# KISBNB — Weekly Progress Report

**Student:** Aisha Khan  
**Week:** 1  
**Date:** 2026-06-07  
**Repository:** https://github.com/aishakhan/kisbnb

## Summary
I completed the Express server setup, connected MongoDB Atlas, and implemented full authentication with JWT and role-based middleware. The API is testable via Postman.

## Completed This Week
- [x] Express project structure (controllers, routes, models, middleware)
- [x] MongoDB Atlas connection with Mongoose
- [x] User model with bcrypt password hashing
- [x] Register, login, GET /auth/me endpoints
- [x] Zod validation on auth routes
- [x] Global error handling middleware
- [x] `protect` and `authorize('host')` middleware

## In Progress
- [ ] Property model and CRUD (starting Week 2)

## Blockers / Help Needed
- None

## Screenshots / Evidence
- Postman: Register → Login → Me (200 with user object)
- Screenshot: `server/src/middleware/errorHandler.js` handling ValidationError

## Hours Logged
| Day | Hours | Focus |
|-----|-------|-------|
| Tue | 4 | Project setup + DB |
| Thu | 5 | Auth + JWT |
| Sat | 3 | Testing + docs |
| **Total** | **12** | |

## Plan for Next Week
1. Property CRUD for hosts
2. Public listing with pagination and filters
3. Begin React + Vite frontend shell
```

---

## Week 2 Example — Properties & Frontend Shell

```markdown
# KISBNB — Weekly Progress Report

**Student:** Aisha Khan  
**Week:** 2  
**Date:** 2026-06-14  

## Summary
Property CRUD is complete on the backend with search filters and pagination. I started the React frontend with Tailwind, routing, and a property listing page connected to the API.

## Completed This Week
- [x] Property Mongoose schema with location, amenities, Unsplash image URLs
- [x] Host-only create/update/delete with ownership checks
- [x] GET /properties with location, price, guests, propertyType filters
- [x] Pagination (page, limit, total count in response)
- [x] Vite + React + Tailwind + React Router setup
- [x] Home page with PropertyCard grid and loading skeletons

## In Progress
- [ ] Property detail page with booking widget (Week 3)

## Blockers / Help Needed
- Resolved: CORS — added CLIENT_URL to .env

## Hours Logged: **14 hours**

## Plan for Next Week
1. Connect auth forms to API (Redux auth slice)
2. Protected routes for host dashboard
3. Property create/edit forms with React Hook Form + Zod
```

---

## Week 3 Example — Full Stack Integration

```markdown
## Summary
Authentication flows work end-to-end. Hosts can create and edit listings from the UI. Search params sync with the URL for shareable filtered searches.

## Completed This Week
- [x] Redux Toolkit auth slice + axios interceptors
- [x] Login, register, logout, protected routes
- [x] CreatePropertyPage and EditPropertyPage with Zod validation
- [x] Debounced location search (400ms)
- [x] Toast notifications for success/error

## Demo
- Video walkthrough: [Loom link]
- Branch: `feature/week-3-integration`
```

---

## Week 4 Example — Bookings, Reviews, Wishlist

```markdown
## Summary
Core marketplace features are implemented: guests can book dates with overlap validation, leave reviews, and manage a wishlist.

## Completed This Week
- [x] Booking API with date conflict detection (409)
- [x] Total price calculation (nights × price)
- [x] Cancel booking (guest only)
- [x] Reviews with average rating on property card
- [x] Wishlist add/remove/toggle

## Metrics
- API endpoints implemented: 24/26
- Frontend pages: 12/14
```

---

## Week 5–6 Example — Deploy & Final

```markdown
# KISBNB — Final Project Report

**Student:** Aisha Khan  
**Date:** 2026-06-28  

## Project Summary
KISBNB is a full-stack rental booking platform (MERN) allowing hosts to list properties and guests to search, book, review, and save favorites.

## Live URLs
- **Frontend:** https://kisbnb.vercel.app
- **Backend:** https://kisbnb-api.onrender.com/api
- **GitHub:** https://github.com/aishakhan/kisbnb

## Tech Stack Delivered
React, Redux Toolkit, Tailwind, Express, MongoDB, JWT, Zod, Docker, Swagger docs

## Features Checklist
| Feature | Status |
|---------|--------|
| Auth (register/login/JWT/roles) | ✅ |
| Property CRUD + images | ✅ |
| Search & filters + pagination | ✅ |
| Booking system | ✅ |
| Guest & host dashboards | ✅ |
| Reviews & ratings | ✅ |
| Wishlist | ✅ |
| Zod validation (client + server) | ✅ |
| Error middleware | ✅ |
| Debounced search | ✅ |
| Loading skeletons | ✅ |
| Toasts | ✅ |
| Docker | ✅ |
| Deployed | ✅ |

## Known Limitations / Future Work
- Payment integration (Stripe) not in scope
- Real-time chat with host not implemented
- Map view for properties (optional enhancement)

## Test Accounts
- Host: host@demo.com
- Guest: guest@demo.com

## Presentation Outline (5 min)
1. Problem & solution (30s)
2. Live demo: search → book → review (3 min)
3. Architecture diagram + tech stack (1 min)
4. Q&A (30s)
```

---

## Daily Standup Snippet (Slack/Discord)

```
Yesterday: Finished booking overlap validation on POST /bookings
Today: Build MyBookingsPage and cancel flow
Blockers: None
```

---

## Instructor Rubric Alignment Notes

When writing reports, explicitly mention:

- **Security:** bcrypt, JWT, owner-only mutations
- **Validation:** Zod on both tiers
- **UX:** skeletons, debounce, toasts, responsive Tailwind
- **Code quality:** folder structure, async error handling
- **DevOps:** Atlas + Vercel + Render + Docker

This helps graders map your work to rubric categories quickly.
