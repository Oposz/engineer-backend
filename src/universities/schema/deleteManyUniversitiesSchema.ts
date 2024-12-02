import { z } from 'zod';

export const deleteManyUniversitiesSchema = z.object({
  universitiesIds: z.array(z.string().min(1)),
});

export type DeleteManyUniversitiesDto = z.infer<
  typeof deleteManyUniversitiesSchema
>;
