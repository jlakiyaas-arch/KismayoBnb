import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getWishlist } from '../services/api/wishlistService';
import PropertyGrid from '../components/property/PropertyGrid';

export default function WishlistPage() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWishlist()
      .then((res) => setProperties(res.data || []))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load wishlist'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
      <p className="mt-1 text-gray-500">Your saved favorite stays</p>
      <div className="mt-8">
        <PropertyGrid
          properties={properties}
          isLoading={isLoading}
          emptyMessage="No saved listings yet. Browse properties and tap the heart to save."
        />
      </div>
    </div>
  );
}
