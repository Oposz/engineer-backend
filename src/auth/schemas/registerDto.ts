import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email('Not valid email'),
    password: z.string().min(4),
    name: z.string().min(1),
    lastName: z.string().min(1),
    university: z.string().min(1),
  })
  .required();

export type RegisterDto = z.infer<typeof registerSchema>;
