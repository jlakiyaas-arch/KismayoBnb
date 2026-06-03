import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { isAuthenticated, user, isHost, isGuest } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-600">
          <span className="text-2xl">🏠</span>
          KISBNB
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/properties" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Explore
          </Link>
          {isHost && (
            <Link
              to="/dashboard/host"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Host dashboard
            </Link>
          )}
          {isGuest && (
            <Link
              to="/bookings"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              My trips
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/wishlist" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Wishlist
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hidden text-sm text-gray-600 hover:text-gray-900 sm:inline">
                Hi, {user?.name?.split(' ')[0]}
              </Link>
              <button type="button" onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
