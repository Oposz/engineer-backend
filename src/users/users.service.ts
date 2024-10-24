import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/registerDto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByCredentials(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    return this.prisma.user.findFirst({
      where: { email, password },
    });
  }

  async getCurrentUser(id: number) {
    const { password, ...user } = await this.prisma.user.findUnique({
      include: {
        university: true,
      },
      where: {
        id: id,
      },
    });
    return user;
  }

  async createOne(userData: RegisterDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        universityId: userData.university,
        lastName: userData.lastName,
      },
    });
  }
}
