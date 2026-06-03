import { Link } from 'react-router-dom';
import { formatPrice, formatPropertyType } from '../../utils/format';
import WishlistButton from './WishlistButton';

export default function PropertyCard({ property }) {
  const image = property.images?.[0];
  const location = [property.location?.city, property.location?.country]
    .filter(Boolean)
    .join(', ');

  return (
    <Link to={`/properties/${property._id}`} className="card group overflow-hidden transition hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <div className="absolute right-2 top-2 z-10">
          <WishlistButton propertyId={property._id} />
        </div>
        <img
          src={image}
          alt={property.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {property.averageRating > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold shadow">
            ★ {property.averageRating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
          <span className="shrink-0 text-sm text-gray-500">{formatPropertyType(property.propertyType)}</span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{location}</p>
        <p className="mt-2 text-sm text-gray-600">
          Up to {property.maxGuests} guests · {property.bedrooms} bed
        </p>
        <p className="mt-2">
          <span className="font-semibold text-gray-900">{formatPrice(property.price)}</span>
          <span className="text-sm text-gray-500"> / night</span>
        </p>
      </div>
    </Link>
  );
}
