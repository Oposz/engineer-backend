import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(3),
    password: z.string().min(3),
  })
  .required();

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
