import { z } from 'zod';

export const signInSchema = z
  .object({
    email: z.string().email('Not valid email'),
    password: z.string().min(4),
  })
  .required();

export type SignInDto = z.infer<typeof signInSchema>;
