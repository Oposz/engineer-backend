import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/schemas/registerDto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findOneByCredentials(email: string, password: string) {
    return this.prisma.user.findFirst({
      where: { email, password },
    });
  }

  async getCurrentUser(id: string) {
    const { password, ...user } =
      (await this.prisma.user.findUnique({
        include: {
          universities: {
            include: {
              projects: true,
            },
          },
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
        role: 'USER',
      },
    });
  }

  getUserUniversities(userId: string) {
    return this.prisma.university.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        leaders: true,
      },
    });
  }

  getUserFavs(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { favourites: true },
    });
  }

  async toggleFav(favId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { favourites: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentFavourites = user.favourites || [];
    const isFavorite = currentFavourites.includes(favId);

    const updatedFavourites = isFavorite
      ? currentFavourites.filter((id) => id !== favId)
      : [...currentFavourites, favId];

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        favourites: updatedFavourites,
      },
      select: {
        favourites: true,
      },
    });
  }

  async connectUniversity(universityId: string, userId: string) {
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

  async getUserTeams(userId: string) {
    const teams = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        projects: {
          include: {
            leadingUniversity: {
              select: {
                name: true,
              },
            },
            leader: {
              select: {
                name: true,
                lastName: true,
              },
            },
            signedUsers: {
              select: {
                id: true,
              },
            },
          },
        },
        position: {
          include: {
            definedPosition: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!teams) {
      return [];
    }

    const positions = teams.position;

    return teams.projects.map((project) => {
      const userPosition = positions.find(
        (position) => position.projectId === project.id,
      );

      return {
        ...project,
        leadingUniversityName: project.leadingUniversity.name,
        role: userPosition?.definedPosition.name,
      };
    });
  }

  getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        name: true,
        lastName: true,
        id: true,
        email: true,
      },
    });
  }
}
