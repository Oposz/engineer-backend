import { z } from 'zod';

export const editUniversitySchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3).optional(),
  photoId: z.string().min(1).optional(),
});

export type EditUniversityDto = z.infer<typeof editUniversitySchema>;
