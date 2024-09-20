import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string, password: string): Promise<User | undefined> {
    return this.prisma.user.findFirst({
      where: { email, password },
    });
  }
}
