import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getHostBookings } from '../services/api/bookingService';
import BookingCard from '../components/booking/BookingCard';
import PropertyCardSkeleton from '../components/ui/PropertyCardSkeleton';
import { formatPrice } from '../utils/format';

export default function HostReservationsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHostBookings()
      .then((res) => setBookings(res.data || []))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load reservations'))
      .finally(() => setIsLoading(false));
  }, []);

  const confirmedEarnings = bookings
    .filter((b) => ['confirmed', 'completed'].includes(b.status))
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
      <p className="mt-1 text-gray-500">
        Bookings on your properties · {formatPrice(confirmedEarnings)} total earnings
      </p>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          <PropertyCardSkeleton />
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500">
          No reservations yet.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => (
            <BookingCard key={b._id} booking={b} showGuest />
          ))}
        </div>
      )}
    </div>
  );
}
