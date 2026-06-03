import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById } from '../services/api/propertyService';
import { formatPropertyType } from '../utils/format';
import PropertyCardSkeleton from '../components/ui/PropertyCardSkeleton';
import BookingWidget from '../components/booking/BookingWidget';
import ReviewsSection from '../components/review/ReviewsSection';
import WishlistButton from '../components/property/WishlistButton';
import toast from 'react-hot-toast';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProperty = () => {
    getPropertyById(id)
      .then((res) => setProperty(res.data?.property))
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Property not found');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="aspect-[16/9] max-h-[480px] animate-pulse rounded-2xl bg-gray-200" />
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
          </div>
          <PropertyCardSkeleton />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-gray-500">Property not found.</p>
        <Link to="/properties" className="mt-4 inline-block text-brand-600 hover:underline">
          Back to listings
        </Link>
      </div>
    );
  }

  const location = [property.location?.city, property.location?.country].filter(Boolean).join(', ');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-2">
        <div className="absolute right-2 top-2 z-10 sm:right-4 sm:top-4">
          <WishlistButton propertyId={property._id} />
        </div>
        {property.images?.slice(0, 4).map((img, i) => (
          <img
            key={img}
            src={img}
            alt=""
            className={`rounded-xl object-cover ${
              i === 0
                ? 'sm:col-span-2 sm:row-span-2 aspect-[4/3] lg:aspect-auto lg:h-full max-h-[400px] w-full'
                : 'aspect-[4/3] max-h-[200px] w-full'
            }`}
          />
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
          <p className="mt-2 text-gray-500">
            {location} · {formatPropertyType(property.propertyType)} · Up to {property.maxGuests}{' '}
            guests
          </p>

          <div className="mt-6 flex items-center gap-4 border-y border-gray-200 py-6">
            {property.host?.avatar && (
              <img
                src={property.host.avatar}
                alt={property.host.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-semibold">Hosted by {property.host?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{property.host?.role}</p>
            </div>
          </div>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-gray-700">
            {property.description}
          </p>

          {property.amenities?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Amenities</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {property.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-gray-600">
                    <span className="text-brand-500">✓</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ReviewsSection propertyId={property._id} onReviewAdded={loadProperty} />
        </div>

        <div className="lg:col-span-1">
          <BookingWidget property={property} />
        </div>
      </div>
    </div>
  );
}
