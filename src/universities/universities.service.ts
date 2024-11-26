import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversitiesService {
  constructor(private prisma: PrismaService) {}

  getUniversities() {
    return this.prisma.university.findMany({
      include: {
        projects: true,
      },
    });
  }

  getUniversity(universityId: string) {
    return this.prisma.university.findFirst({
      where: {
        id: universityId,
      },
      include: {
        projects: {
          include: {
            signedUsers: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
  }

  async toggleUniversityFav(universityId: string) {
    const university = await this.prisma.university.findUnique({
      where: {
        id: universityId,
      },
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    return this.prisma.university.update({
      where: {
        id: universityId,
      },
      data: {
        favourite: !university.favourite,
      },
    });
  }
}
