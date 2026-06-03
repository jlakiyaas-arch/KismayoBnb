import { Link } from 'react-router-dom';
import { formatPrice, formatDate } from '../../utils/format';

const statusStyles = {
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600',
  completed: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

export default function BookingCard({ booking, onCancel, showGuest }) {
  const property = booking.property;
  const canCancel = booking.status === 'confirmed' && new Date(booking.checkOut) >= new Date();

  return (
    <div className="card overflow-hidden sm:flex">
      <img
        src={property?.images?.[0]}
        alt=""
        className="h-48 w-full object-cover sm:h-auto sm:w-48"
      />
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              to={`/properties/${property?._id}`}
              className="text-lg font-semibold text-gray-900 hover:text-brand-600"
            >
              {property?.title}
            </Link>
            <p className="text-sm text-gray-500">
              {[property?.location?.city, property?.location?.country].filter(Boolean).join(', ')}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
              statusStyles[booking.status] || statusStyles.pending
            }`}
          >
            {booking.status}
          </span>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)} · {booking.nights} nights
        </p>
        <p className="mt-1 font-semibold">{formatPrice(booking.totalPrice)} total</p>

        {showGuest && booking.guest && (
          <p className="mt-2 text-sm text-gray-500">Guest: {booking.guest.name}</p>
        )}

        {onCancel && canCancel && (
          <button
            type="button"
            onClick={() => onCancel(booking._id)}
            className="mt-4 self-start text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Cancel trip
          </button>
        )}
      </div>
    </div>
  );
}
