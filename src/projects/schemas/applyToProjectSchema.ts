import { z } from 'zod';

export const applyToProjectSchema = z.object({
  projectId: z.string().min(1),
  id: z.string().min(1),
});

export type ApplyToProjectDto = z.infer<typeof applyToProjectSchema>;
