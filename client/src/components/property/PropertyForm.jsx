import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  propertyFormSchema,
  PROPERTY_TYPES,
  AMENITY_OPTIONS,
  toPropertyPayload,
} from '../../utils/propertySchemas';

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800';

export default function PropertyForm({ defaultValues, onSubmit, isSubmitting, submitLabel = 'Save' }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: defaultValues || {
      title: '',
      description: '',
      price: '',
      location: { address: '', city: '', country: '' },
      amenities: [],
      images: [{ url: '' }],
      propertyType: 'apartment',
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'images' });
  const watchedImages = watch('images');
  const watchedAmenities = watch('amenities') || [];

  const toggleAmenity = (amenity) => {
    const next = watchedAmenities.includes(amenity)
      ? watchedAmenities.filter((a) => a !== amenity)
      : [...watchedAmenities, amenity];
    setValue('amenities', next);
  };

  const handleFormSubmit = (data) => onSubmit(toPropertyPayload(data));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900">Basic info</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input className="input-field" placeholder="Cozy studio in Paris" {...register('title')} />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={5}
              className="input-field"
              placeholder="Describe your property (min 20 characters)..."
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price per night ($)</label>
              <input type="number" min="1" className="input-field" {...register('price')} />
              {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Property type</label>
              <select className="input-field" {...register('propertyType')}>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Max guests</label>
              <input type="number" min="1" className="input-field" {...register('maxGuests')} />
              {errors.maxGuests && (
                <p className="mt-1 text-xs text-red-600">{errors.maxGuests.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Bedrooms</label>
              <input type="number" min="0" className="input-field" {...register('bedrooms')} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Bathrooms</label>
              <input type="number" min="0" className="input-field" {...register('bathrooms')} />
            </div>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900">Location</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Street address</label>
            <input className="input-field" {...register('location.address')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
            <input className="input-field" {...register('location.city')} />
            {errors.location?.city && (
              <p className="mt-1 text-xs text-red-600">{errors.location.city.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
            <input className="input-field" {...register('location.country')} />
            {errors.location?.country && (
              <p className="mt-1 text-xs text-red-600">{errors.location.country.message}</p>
            )}
          </div>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Images (Unsplash URLs)</h2>
          <button
            type="button"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            onClick={() => append({ url: SAMPLE_IMAGE })}
          >
            + Add image
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Paste links from{' '}
          <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="text-brand-600">
            unsplash.com
          </a>
        </p>
        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-3 sm:flex-row sm:items-start">
              {watchedImages?.[index]?.url && (
                <img
                  src={watchedImages[index].url}
                  alt=""
                  className="h-24 w-32 shrink-0 rounded-lg object-cover bg-gray-100"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1">
                <input
                  className="input-field"
                  placeholder={SAMPLE_IMAGE}
                  {...register(`images.${index}.url`)}
                />
                {errors.images?.[index]?.url && (
                  <p className="mt-1 text-xs text-red-600">{errors.images[index].url.message}</p>
                )}
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="btn-secondary shrink-0 text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {errors.images?.message && (
            <p className="text-xs text-red-600">{errors.images.message}</p>
          )}
          {errors.images?.root && (
            <p className="text-xs text-red-600">{errors.images.root.message}</p>
          )}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`rounded-full border px-3 py-1.5 text-sm capitalize transition ${
                watchedAmenities.includes(amenity)
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[140px]">
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
