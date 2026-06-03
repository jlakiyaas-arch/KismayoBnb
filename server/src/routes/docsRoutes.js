import { Router } from 'express';

const router = Router();

const endpoints = [
  { method: 'GET', path: '/api/health', auth: 'Public', description: 'Health check' },
  { method: 'POST', path: '/api/auth/register', auth: 'Public', description: 'Register' },
  { method: 'POST', path: '/api/auth/login', auth: 'Public', description: 'Login' },
  { method: 'GET', path: '/api/auth/me', auth: 'JWT', description: 'Current user' },
  { method: 'GET', path: '/api/properties', auth: 'Public', description: 'List properties (filters)' },
  { method: 'GET', path: '/api/properties/featured', auth: 'Public', description: 'Featured stays (exclude currently booked)' },
  { method: 'POST', path: '/api/properties', auth: 'Host', description: 'Create property' },
  { method: 'GET', path: '/api/properties/:id', auth: 'Public', description: 'Property detail' },
  { method: 'POST', path: '/api/bookings', auth: 'Guest', description: 'Create booking' },
  { method: 'GET', path: '/api/bookings/my', auth: 'Guest', description: 'My bookings' },
  { method: 'PATCH', path: '/api/bookings/:id/cancel', auth: 'Guest', description: 'Cancel booking' },
  { method: 'GET', path: '/api/reviews/property/:propertyId', auth: 'Public', description: 'Property reviews' },
  { method: 'POST', path: '/api/reviews', auth: 'Guest', description: 'Create review' },
  { method: 'GET', path: '/api/wishlist', auth: 'JWT', description: 'Get wishlist' },
  { method: 'POST', path: '/api/wishlist/:propertyId', auth: 'JWT', description: 'Add to wishlist' },
  { method: 'GET', path: '/api/dashboard/host/stats', auth: 'Host', description: 'Host dashboard stats' },
];

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'KISBNB API',
    version: '1.0.0',
    documentation: 'https://github.com/your-repo/KISBNB/blob/main/docs/API_ROUTES.md',
    endpoints,
  });
});

export default router;
