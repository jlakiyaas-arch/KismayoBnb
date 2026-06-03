import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSearch from '../components/property/HeroSearch';
import PropertyGrid from '../components/property/PropertyGrid';
import { getFeaturedProperties } from '../services/api/propertyService';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFeaturedProperties({ limit: 8, sort: '-createdAt' })
      .then((res) => setProperties(res.data || []))
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load properties');
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-50 via-white to-rose-50 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Find your next stay
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Discover unique homes and experiences around the world.
          </p>
          <div className="mt-10">
            <HeroSearch />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featured stays</h2>
          <Link to="/properties" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        <PropertyGrid
          properties={properties}
          isLoading={isLoading}
          emptyMessage="No listings yet. Start the API and run npm run seed."
        />
      </section>
    </div>
  );
}
