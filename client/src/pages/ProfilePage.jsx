import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { updateMe } from '../services/api/authService';
import { setCredentials } from '../store/slices/authSlice';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  avatar: z.union([z.string().url('Must be a valid URL'), z.literal('')]).optional(),
});

export default function ProfilePage() {
  const { user, token } = useAuth();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      avatar: user?.avatar || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        ...(data.avatar?.trim() && { avatar: data.avatar.trim() }),
      };
      const res = await updateMe(payload);
      dispatch(setCredentials({ user: res.data.user, token }));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      <p className="mt-1 text-gray-500">{user?.email}</p>
      <p className="text-sm capitalize text-gray-400">{user?.role}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="card mt-8 space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input className="input-field" {...register('name')} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Avatar URL</label>
          <input className="input-field" placeholder="https://..." {...register('avatar')} />
          {errors.avatar && <p className="mt-1 text-xs text-red-600">{errors.avatar.message}</p>}
        </div>
        {user?.avatar && (
          <img src={user.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
        )}
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
