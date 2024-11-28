import { z } from 'zod';

export const updateProjectSchema = z.object({
  projectName: z.string().min(3),
  description: z.string(),
  university: z.string().min(1),
  leader: z.string().min(1),
  dueTo: z.string().min(1),
  photo: z.string(),
  sponsors: z.array(
    z
      .object({
        name: z.string().min(1),
        description: z.string(),
        photo: z.string().optional(),
        photoId: z.string().optional(),
        id: z.string().optional(),
      })
      .optional(),
  ),
  positions: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1),
      quantity: z.number().min(1),
    }),
  ),
  positionsToDelete: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      quantity: z.number().min(1),
    }),
  ),
  deletedSponsors: z.array(
    z
      .object({
        name: z.string().min(1),
        description: z.string(),
        photo: z.string().optional(),
        photoId: z.string(),
        id: z.string(),
      })
      .optional(),
  ),
});

export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
