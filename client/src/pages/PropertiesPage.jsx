import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/property/FilterBar';
import PropertyGrid from '../components/property/PropertyGrid';
import Pagination from '../components/property/Pagination';
import { getProperties } from '../services/api/propertyService';
import toast from 'react-hot-toast';

export default function PropertiesPage() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setIsLoading(true);
    getProperties(params)
      .then((res) => {
        setProperties(res.data || []);
        setPagination(res.pagination);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load properties');
      })
      .finally(() => setIsLoading(false));
  }, [searchParams.toString()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Explore stays</h1>
      <div className="mb-8">
        <FilterBar />
      </div>
      <PropertyGrid properties={properties} isLoading={isLoading} />
      <Pagination pagination={pagination} />
    </div>
  );
}
