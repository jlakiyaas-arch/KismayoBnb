import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyForm from '../components/property/PropertyForm';
import { getPropertyById, updateProperty } from '../services/api/propertyService';
import { propertyToFormValues } from '../utils/propertySchemas';
import PropertyCardSkeleton from '../components/ui/PropertyCardSkeleton';

export default function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getPropertyById(id)
      .then((res) => setDefaultValues(propertyToFormValues(res.data.property)))
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Property not found');
        navigate('/host/properties');
      })
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      const res = await updateProperty(id, payload);
      toast.success(res.message || 'Property updated!');
      navigate('/host/properties');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update property';
      const fieldErrors = err.response?.data?.errors;
      if (fieldErrors?.length) {
        fieldErrors.forEach((e) => toast.error(`${e.path}: ${e.message}`));
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <PropertyCardSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/host/properties" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
        ← Back to my properties
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit property</h1>
      <div className="mt-8">
        <PropertyForm
          key={id}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
