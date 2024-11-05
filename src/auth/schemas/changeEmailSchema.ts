import { z } from 'zod';

export const changeEmailSchema = z
  .object({
    newEmail: z.string().email('Not valid email'),
    password: z.string().min(3),
  })
  .required();

export type ChangeEmailDto = z.infer<typeof changeEmailSchema>;
