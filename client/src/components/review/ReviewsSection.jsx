import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { getPropertyReviews, createReview } from '../../services/api/reviewService';

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters').max(1000),
});

export default function ReviewsSection({ propertyId, onReviewAdded }) {
  const { isAuthenticated, isGuest } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const loadReviews = () => {
    getPropertyReviews(propertyId)
      .then((res) => setReviews(res.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, [propertyId]);

  const onSubmit = async (data) => {
    try {
      await createReview({ property: propertyId, ...data });
      toast.success('Review submitted!');
      reset({ rating: 5, comment: '' });
      loadReviews();
      onReviewAdded?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    }
  };

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>

      {isAuthenticated && isGuest && (
        <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 space-y-4 p-4">
          <p className="text-sm text-gray-500">
            Share your experience after your stay (check-out must have passed).
          </p>
          <div>
            <label className="mb-1 block text-sm font-medium">Rating</label>
            <select className="input-field w-24" {...register('rating')}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Comment</label>
            <textarea rows={3} className="input-field" {...register('comment')} />
            {errors.comment && (
              <p className="mt-1 text-xs text-red-600">{errors.comment.message}</p>
            )}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Submitting...' : 'Submit review'}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="card p-4">
              <div className="flex items-center gap-3">
                <img
                  src={review.user?.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{review.user?.name}</p>
                  <p className="text-sm text-amber-600">{'★'.repeat(review.rating)}</p>
                </div>
              </div>
              <p className="mt-3 text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
