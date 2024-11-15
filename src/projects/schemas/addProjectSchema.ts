import { z } from 'zod';

export const addNewProjectSchema = z
  .object({
    name: z.string().min(1),
  })
  .required();

export type AddNewProjectDto = z.infer<typeof addNewProjectSchema>;
