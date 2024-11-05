import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/schemas/registerDto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByCredentials(email: string, password: string) {
    return this.prisma.user.findFirst({
      where: { email, password },
    });
  }

  async getCurrentUser(id: number) {
    const { password, ...user } =
      (await this.prisma.user.findUnique({
        include: {
          universities: true,
        },
        where: {
          id: id,
        },
      })) || {};
    return user;
  }

  async createOne(userData: RegisterDto) {
    return this.prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        universities: {
          connect: { id: userData.university },
        },
        lastName: userData.lastName,
      },
    });
  }

  async connectUniversity(universityId: number, userId: number) {
    const universityToConnect = await this.prisma.university.findUnique({
      where: { id: universityId },
    });

    if (!universityToConnect) {
      throw new NotFoundException();
    }
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        universities: {
          connect: universityToConnect,
        },
      },
    });
  }
}
