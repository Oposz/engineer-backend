import { User } from '@prisma/client';

export function CreateJwtPayload(user: User) {
  return {
    sub: user.id,
    role: user.role,
    email: user.email,
  };
}
