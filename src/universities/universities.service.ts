import { Injectable } from '@nestjs/common';
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
}
