import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyForm from '../components/property/PropertyForm';
import { createProperty } from '../services/api/propertyService';

export default function CreatePropertyPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      const res = await createProperty(payload);
      toast.success(res.message || 'Property created!');
      navigate('/host/properties');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create property';
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/host/properties" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
        ← Back to my properties
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Add new property</h1>
      <p className="mt-2 text-gray-500">List your space for guests to discover and book.</p>
      <div className="mt-8">
        <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create listing" />
      </div>
    </div>
  );
}
