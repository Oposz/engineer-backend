import { User } from '@prisma/client';

export function CreateJwtPayload(user: User) {
  return {
    sub: user.id,
    username: user.name,
    userLastName: user.lastName,
    email: user.email,
  };
}
