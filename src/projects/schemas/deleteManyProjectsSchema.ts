import { z } from 'zod';

export const deleteManyProjectsSchema = z.object({
  projectIds: z.array(z.string().min(1)),
});

export type DeleteManyProjectsDto = z.infer<typeof deleteManyProjectsSchema>;
