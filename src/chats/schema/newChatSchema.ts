import { z } from 'zod';

export const newChatSchema = z
  .object({
    users: z.array(z.string().min(1)).nonempty(),
  })
  .required();

export type NewChatDto = z.infer<typeof newChatSchema>;
