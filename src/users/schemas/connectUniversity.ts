import { z } from 'zod';

export const connectUniversitySchema = z
  .object({
    universityId: z.string().min(1),
  })
  .required();

export type ConnectUniversityDto = z.infer<typeof connectUniversitySchema>;
