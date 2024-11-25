import { z } from 'zod';

export const chatNewNameSchema = z.object({
  name: z.string().min(1),
});
export type ChatNewNameDto = z.infer<typeof chatNewNameSchema>;
