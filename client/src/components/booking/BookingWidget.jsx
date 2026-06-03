import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice, getNights } from '../../utils/format';
import { createBooking } from '../../services/api/bookingService';

export default function BookingWidget({ property }) {
  const { isAuthenticated, isGuest, isHost } = useAuth();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nights = checkIn && checkOut ? getNights(checkIn, checkOut) : 0;
  const total = nights > 0 ? nights * property.price : 0;

  const today = new Date().toISOString().split('T')[0];

  const handleReserve = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book');
      navigate('/login');
      return;
    }
    if (!isGuest) {
      toast.error('Switch to a guest account to book stays');
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error('Select check-in and check-out dates');
      return;
    }
    if (nights < 1) {
      toast.error('Check-out must be after check-in');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createBooking({
        property: property._id,
        checkIn,
        checkOut,
      });
      toast.success(res.message || 'Booking confirmed!');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card sticky top-24 p-6">
      <p className="text-2xl font-bold">
        {formatPrice(property.price)}
        <span className="text-base font-normal text-gray-500"> / night</span>
      </p>
      {property.averageRating > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          ★ {property.averageRating.toFixed(1)} ({property.reviewCount} reviews)
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">Check-in</label>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="input-field text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">Check-out</label>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="input-field text-sm"
          />
        </div>
      </div>

      {nights > 0 && (
        <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>
              {formatPrice(property.price)} × {nights} nights
            </span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleReserve}
        disabled={isSubmitting || (isHost && isAuthenticated)}
        className="btn-primary mt-4 w-full"
      >
        {isSubmitting ? 'Booking...' : 'Reserve'}
      </button>
      {isHost && isAuthenticated && (
        <p className="mt-2 text-center text-xs text-gray-500">Hosts cannot book listings</p>
      )}
    </div>
  );
}
