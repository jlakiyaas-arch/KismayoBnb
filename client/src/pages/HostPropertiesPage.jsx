import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyProperties, deleteProperty } from '../services/api/propertyService';
import { formatPrice } from '../utils/format';
import ConfirmModal from '../components/ui/ConfirmModal';
import PropertyCardSkeleton from '../components/ui/PropertyCardSkeleton';

export default function HostPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProperties = () => {
    setIsLoading(true);
    getMyProperties()
      .then((res) => setProperties(res.data || []))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load properties'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteProperty(deleteId);
      toast.success('Property deleted');
      setDeleteId(null);
      loadProperties();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My properties</h1>
          <p className="mt-1 text-gray-500">Manage your listings</p>
        </div>
        <Link to="/host/properties/new" className="btn-primary text-center">
          + Add property
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-gray-500">You haven&apos;t listed any properties yet.</p>
          <Link to="/host/properties/new" className="btn-primary mt-6 inline-block">
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Property</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 sm:table-cell">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Price</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={property.images?.[0]}
                        alt=""
                        className="h-12 w-16 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{property.title}</p>
                        <p className="text-xs text-gray-500 capitalize">{property.propertyType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 text-sm text-gray-600 sm:table-cell">
                    {property.location?.city}, {property.location?.country}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">{formatPrice(property.price)}/night</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/properties/${property._id}`}
                        className="btn-secondary text-xs px-3 py-1.5"
                      >
                        View
                      </Link>
                      <Link
                        to={`/host/properties/${property._id}/edit`}
                        className="btn-secondary text-xs px-3 py-1.5"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(property._id)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete property?"
        message="This cannot be undone. All data for this listing will be removed."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
