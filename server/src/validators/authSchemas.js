import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters')
    .trim(),
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address').trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['guest', 'host']).optional().default('guest'),
});

export const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address').trim(),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).trim().optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
});
