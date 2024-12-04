import { z } from 'zod';

export const addNewLeaderSchema = z.object({
  department: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(9),
  title: z.string().min(2),
  university: z.string().min(1),
  photoId: z.string().min(1).optional(),
});

export type AddNewLeadersDto = z.infer<typeof addNewLeaderSchema>;
