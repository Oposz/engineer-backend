import { z } from 'zod';

export const addNewProjectSchema = z.object({
  projectName: z.string().min(3),
  description: z.string(),
  university: z.string().min(1),
  leader: z.string().min(1),
  dueTo: z.string().min(1),
  photo: z.string(),
  sponsors: z.array(
    z.object({
      name: z.string().min(1),
      description: z.string(),
      photo: z.string().min(1),
    }),
  ),
  positions: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number().min(1),
    }),
  ),
});

export type AddNewProjectDto = z.infer<typeof addNewProjectSchema>;
