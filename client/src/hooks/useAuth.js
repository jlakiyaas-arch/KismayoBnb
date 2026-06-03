import { useSelector } from 'react-redux';
import { selectAuth, selectIsHost } from '../store/slices/authSlice';

export function useAuth() {
  const auth = useSelector(selectAuth);
  const isHost = useSelector(selectIsHost);

  return {
    ...auth,
    isHost,
    isGuest: auth.user?.role === 'guest',
  };
}
