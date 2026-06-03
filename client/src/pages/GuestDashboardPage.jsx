import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMyBookings } from '../services/api/bookingService';
import { getWishlist } from '../services/api/wishlistService';

export default function GuestDashboardPage() {
  const { user } = useAuth();
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    getMyBookings().then((res) => {
      const upcoming = (res.data || []).filter(
        (b) => b.status === 'confirmed' && new Date(b.checkOut) >= new Date()
      );
      setUpcomingCount(upcoming.length);
    });
    getWishlist().then((res) => setWishlistCount(res.data?.length || 0));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Guest dashboard</h1>
      <p className="mt-2 text-gray-500">Welcome back, {user?.name}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm text-gray-500">Upcoming trips</p>
          <p className="mt-1 text-3xl font-bold">{upcomingCount}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-500">Saved listings</p>
          <p className="mt-1 text-3xl font-bold">{wishlistCount}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link to="/bookings" className="btn-primary">
          My bookings
        </Link>
        <Link to="/wishlist" className="btn-secondary">
          Wishlist
        </Link>
        <Link to="/properties" className="btn-secondary">
          Explore stays
        </Link>
      </div>
    </div>
  );
}
