import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    displayName: z.string().min(2, 'Display name must be at least 2 characters'),
    displayNameAr: z.string().optional(),
    city: z.string().optional(),
    language: z.enum(['ar', 'en']).optional().default('ar'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    displayName: z.string().min(2).optional(),
    displayNameAr: z.string().optional(),
    city: z.string().optional(),
    language: z.enum(['ar', 'en']).optional(),
    avatar: z.string().url().optional(),
  }),
});

