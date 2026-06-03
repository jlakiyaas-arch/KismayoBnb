import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getHostStats } from '../services/api/dashboardService';
import { formatPrice } from '../utils/format';

export default function HostDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getHostStats()
      .then((res) => setStats(res.data))
      .catch(() => toast.error('Could not load dashboard stats'));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Host dashboard</h1>
      <p className="mt-2 text-gray-500">Welcome, {user?.name}. Manage your listings and reservations.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm text-gray-500">Total listings</p>
          <p className="mt-1 text-3xl font-bold">{stats?.totalProperties ?? '—'}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-500">Active reservations</p>
          <p className="mt-1 text-3xl font-bold">{stats?.activeBookings ?? '—'}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-500">Total earnings</p>
          <p className="mt-1 text-3xl font-bold">
            {stats ? formatPrice(stats.totalEarnings) : '—'}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link to="/host/properties" className="card p-6 transition hover:shadow-md">
          <p className="text-lg font-semibold">My properties</p>
          <p className="mt-1 text-sm text-gray-500">View and edit listings</p>
        </Link>
        <Link to="/host/properties/new" className="card p-6 transition hover:shadow-md">
          <p className="text-lg font-semibold">Add property</p>
          <p className="mt-1 text-sm text-gray-500">Create a new listing</p>
        </Link>
        <Link to="/host/reservations" className="card p-6 transition hover:shadow-md">
          <p className="text-lg font-semibold">Reservations</p>
          <p className="mt-1 text-sm text-gray-500">View guest bookings</p>
        </Link>
      </div>
    </div>
  );
}
