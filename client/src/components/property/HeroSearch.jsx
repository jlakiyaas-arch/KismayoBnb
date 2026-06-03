import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSearch() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (guests) params.set('guests', guests);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label className="mb-1 block text-xs font-semibold text-gray-700">Where</label>
        <input
          type="text"
          placeholder="Search destinations"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="w-full sm:w-32">
        <label className="mb-1 block text-xs font-semibold text-gray-700">Guests</label>
        <input
          type="number"
          min="1"
          placeholder="1"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="input-field"
        />
      </div>
      <button type="submit" className="btn-primary w-full sm:w-auto sm:px-8">
        Search
      </button>
    </form>
  );
}
