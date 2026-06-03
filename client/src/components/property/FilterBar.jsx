import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'cabin', 'hotel', 'other'];

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const debouncedLocation = useDebounce(location, 400);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedLocation) params.set('location', debouncedLocation);
    else params.delete('location');
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  }, [debouncedLocation]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className="card p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Location</label>
          <input
            type="text"
            placeholder="City or country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Min price</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            defaultValue={searchParams.get('minPrice') || ''}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Max price</label>
          <input
            type="number"
            min="0"
            placeholder="500"
            defaultValue={searchParams.get('maxPrice') || ''}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Guests</label>
          <input
            type="number"
            min="1"
            placeholder="1"
            defaultValue={searchParams.get('guests') || ''}
            onChange={(e) => updateParam('guests', e.target.value)}
            className="input-field"
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="mb-1 block text-xs font-medium text-gray-600">Type</label>
          <select
            defaultValue={searchParams.get('propertyType') || ''}
            onChange={(e) => updateParam('propertyType', e.target.value)}
            className="input-field"
          >
            <option value="">All types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Sort</label>
          <select
            defaultValue={searchParams.get('sort') || '-createdAt'}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="input-field"
          >
            <option value="-createdAt">Newest</option>
            <option value="price">Price: low</option>
            <option value="-price">Price: high</option>
            <option value="-averageRating">Top rated</option>
          </select>
        </div>
      </div>
    </div>
  );
}
