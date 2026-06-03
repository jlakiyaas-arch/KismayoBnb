import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { checkWishlist, addToWishlist, removeFromWishlist } from '../../services/api/wishlistService';

export default function WishlistButton({ propertyId, className = '' }) {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !propertyId) return;
    checkWishlist(propertyId)
      .then((res) => setIsSaved(res.data?.isSaved))
      .catch(() => {});
  }, [isAuthenticated, propertyId]);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Log in to save favorites');
      return;
    }
    setIsLoading(true);
    try {
      if (isSaved) {
        await removeFromWishlist(propertyId);
        setIsSaved(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(propertyId);
        setIsSaved(true);
        toast.success('Saved to wishlist');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isLoading}
      className={`rounded-full bg-white/90 p-2 shadow-md transition hover:scale-110 ${className}`}
      aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <span className="text-xl">{isSaved ? '❤️' : '🤍'}</span>
    </button>
  );
}
