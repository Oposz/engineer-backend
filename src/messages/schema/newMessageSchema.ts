import { z } from 'zod';

export const newMessageSchema = z
  .object({
    message: z.string().min(1),
    new: z.boolean(),
    chatId: z.string().min(1),
  })
  .required();

export type NewMessageDto = z.infer<typeof newMessageSchema>;
