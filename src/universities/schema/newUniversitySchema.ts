import { z } from 'zod';

export const newUniversitySchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3).optional(),
  photoId: z.string().min(1).optional(),
});

export type NewUniversityDto = z.infer<typeof newUniversitySchema>;
