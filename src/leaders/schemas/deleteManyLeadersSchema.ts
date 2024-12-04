import { z } from 'zod';

export const deleteManyLeaderSchema = z.object({
  leadersIds: z.array(z.string().min(1)),
});

export type DeleteManyLeadersDto = z.infer<typeof deleteManyLeaderSchema>;
