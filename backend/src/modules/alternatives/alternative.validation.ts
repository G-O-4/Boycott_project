import { z } from 'zod';

export const createAlternativeSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    alternativeId: z.string().min(1, 'Alternative product ID is required'),
    isExactAlternative: z.boolean().optional(),
    notes: z.string().optional(),
    notesAr: z.string().optional(),
  }),
});

