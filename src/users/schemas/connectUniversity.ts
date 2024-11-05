import { z } from 'zod';

export const connectUniversitySchema = z
  .object({
    universityId: z.number(),
  })
  .required();

export type ConnectUniversityDto = z.infer<typeof connectUniversitySchema>;
