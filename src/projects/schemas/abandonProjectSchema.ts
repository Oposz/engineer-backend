import { z } from 'zod';

export const abandonProjectSchema = z.object({
  projectId: z.string().min(1),
});

export type AbandonProjectDto = z.infer<typeof abandonProjectSchema>;
