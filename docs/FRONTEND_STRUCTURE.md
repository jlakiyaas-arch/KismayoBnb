# React Frontend Structure

## Route Map

| Path | Page | Access | Description |
|------|------|--------|-------------|
| `/` | `HomePage` | Public | Hero, search bar, property grid |
| `/properties` | `PropertiesPage` | Public | Full listing + filters (URL sync) |
| `/properties/:id` | `PropertyDetailPage` | Public | Gallery, book widget, reviews |
| `/login` | `LoginPage` | Public | Login form |
| `/register` | `RegisterPage` | Public | Register (role select) |
| `/wishlist` | `WishlistPage` | Protected | Saved properties |
| `/bookings` | `MyBookingsPage` | Guest | Active + history |
| `/dashboard/guest` | `GuestDashboardPage` | Guest | Overview |
| `/dashboard/host` | `HostDashboardPage` | Host | Stats, quick links |
| `/host/properties` | `HostPropertiesPage` | Host | Manage listings |
| `/host/properties/new` | `CreatePropertyPage` | Host | Create form |
| `/host/properties/:id/edit` | `EditPropertyPage` | Host | Edit form |
| `/host/reservations` | `HostReservationsPage` | Host | Incoming bookings |
| `/profile` | `ProfilePage` | Protected | Edit profile |
| `*` | `NotFoundPage` | Public | 404 |

---

## Component Tree

```
App
├── ToastProvider (react-hot-toast)
├── RouterProvider
│   └── RootLayout
│       ├── Navbar
│       │   ├── Logo
│       │   ├── SearchBar (compact)
│       │   ├── NavLinks (Wishlist, Host dashboard)
│       │   └── UserMenu (Login / Avatar dropdown)
│       ├── Outlet
│       └── Footer
│
├── HomePage
│   ├── HeroSearch
│   ├── FeaturedProperties
│   └── PropertyGrid + PropertyCardSkeleton
│
├── PropertiesPage
│   ├── FilterSidebar / FilterBar
│   │   ├── LocationInput (debounced)
│   │   ├── DateRangePicker
│   │   ├── PriceRangeSlider
│   │   ├── GuestsSelect
│   │   └── PropertyTypeSelect
│   ├── SortDropdown
│   └── PropertyGrid + Pagination
│
├── PropertyDetailPage
│   ├── ImageGallery
│   ├── PropertyInfo (amenities, host card)
│   ├── BookingCard (dates, guests, total, Book button)
│   ├── WishlistButton
│   └── ReviewsSection
│       ├── ReviewForm (if eligible)
│       ├── StarRating display
│       └── ReviewList
│
├── CreatePropertyPage / EditPropertyPage
│   └── PropertyForm (RHF + Zod)
│       ├── BasicFields
│       ├── LocationFields
│       ├── AmenitiesCheckboxes
│       └── ImageUrlList (Unsplash links + preview)
│
├── MyBookingsPage
│   └── BookingCardList (status badge, cancel)
│
├── HostDashboardPage
│   ├── StatsCards (properties, bookings, earnings)
│   └── RecentReservationsTable
│
└── WishlistPage
    └── PropertyGrid (empty state)
```

---

## Redux Store Structure

```javascript
// store/index.js
configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer, // RTK Query optional
  },
  middleware: (getDefault) =>
    getDefault().concat(api.middleware),
});

// store/slices/authSlice.js
{
  user: null | { _id, name, email, role, avatar },
  token: null | string,
  isAuthenticated: boolean,
  isLoading: boolean,
}

// store/api/apiSlice.js (RTK Query endpoints)
endpoints: (builder) => ({
  getProperties: builder.query(...),
  getPropertyById: builder.query(...),
  createBooking: builder.mutation(...),
  // ...
})
```

---

## Key Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useAuth` | `hooks/useAuth.js` | user, login, logout, isHost |
| `useDebounce` | `hooks/useDebounce.js` | Debounce search input (300–500ms) |
| `usePagination` | `hooks/usePagination.js` | Sync page with URL query |

---

## Services (`services/api/`)

```
services/api/
├── axios.js          # baseURL, interceptors
├── authService.js
├── propertyService.js
├── bookingService.js
├── reviewService.js
└── wishlistService.js
```

**axios.js interceptor pattern:**

```javascript
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
```

---

## Protected Routes

```jsx
// components/routing/ProtectedRoute.jsx
function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

// Usage in router
<Route element={<ProtectedRoute roles={['host']} />}>
  <Route path="/host/properties" element={<HostPropertiesPage />} />
</Route>
```

---

## Form + Zod (Client)

```javascript
// utils/propertySchema.js
import { z } from 'zod';

export const propertyFormSchema = z.object({
  title: z.string().min(3, 'Title too short'),
  description: z.string().min(20),
  price: z.coerce.number().positive(),
  // ...
});

// CreatePropertyPage.jsx
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(propertyFormSchema),
});
```

---

## UI Patterns

### Loading skeletons

- `PropertyCardSkeleton` — pulse gray blocks for image + text
- Use while `isLoading` from RTK Query or local state

### Toast notifications

```javascript
import toast from 'react-hot-toast';

toast.success('Booking confirmed!');
toast.error(error.response?.data?.message || 'Something went wrong');
```

### Debounced search

```javascript
const [location, setLocation] = useState('');
const debouncedLocation = useDebounce(location, 400);

useEffect(() => {
  setSearchParams({ location: debouncedLocation, page: '1' });
}, [debouncedLocation]);
```

---

## Tailwind Layout Conventions

- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Cards: `rounded-xl shadow-md hover:shadow-lg transition`
- Primary button: `bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-4 py-2`
- Airbnb-inspired accent: rose/coral (`rose-500`, `rose-600`)

---

## Environment Variables (Client)

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=KISBNB
```

Access: `import.meta.env.VITE_API_URL`

---

## File Checklist (create in order)

1. `main.jsx`, `App.jsx`, `index.css` (Tailwind)
2. `store/`, `services/api/axios.js`
3. `components/layout/`
4. `pages/HomePage.jsx`, `LoginPage.jsx`, `RegisterPage.jsx`
5. `pages/PropertyDetailPage.jsx`
6. Host & dashboard pages
7. `hooks/useDebounce.js`
