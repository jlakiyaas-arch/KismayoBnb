import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyBookings, cancelBooking } from '../services/api/bookingService';
import BookingCard from '../components/booking/BookingCard';
import ConfirmModal from '../components/ui/ConfirmModal';
import PropertyCardSkeleton from '../components/ui/PropertyCardSkeleton';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const load = () => {
    setIsLoading(true);
    getMyBookings()
      .then((res) => setBookings(res.data || []))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load bookings'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async () => {
    if (!cancelId) return;
    setIsCancelling(true);
    try {
      await cancelBooking(cancelId);
      toast.success('Booking cancelled');
      setCancelId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    } finally {
      setIsCancelling(false);
    }
  };

  const upcoming = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.checkOut) >= new Date()
  );
  const past = bookings.filter(
    (b) => b.status === 'cancelled' || new Date(b.checkOut) < new Date()
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">My bookings</h1>
      <p className="mt-1 text-gray-500">Manage your trips</p>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500">
          No bookings yet. Explore stays and reserve your first trip!
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900">Upcoming</h2>
              <div className="mt-4 space-y-4">
                {upcoming.map((b) => (
                  <BookingCard key={b._id} booking={b} onCancel={setCancelId} />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900">Past & cancelled</h2>
              <div className="mt-4 space-y-4">
                {past.map((b) => (
                  <BookingCard key={b._id} booking={b} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <ConfirmModal
        open={Boolean(cancelId)}
        title="Cancel booking?"
        message="This will free up the dates for other guests."
        confirmLabel="Cancel booking"
        isLoading={isCancelling}
        onCancel={() => setCancelId(null)}
        onConfirm={handleCancel}
      />
    </div>
  );
}
