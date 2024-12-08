import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeleteManyUniversitiesDto } from './schema/deleteManyUniversitiesSchema';
import { NewUniversityDto } from './schema/newUniversitySchema';
import { EditUniversityDto } from './schema/editUniversitySchema';

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

  getUniversitiesWithDetails() {
    return this.prisma.university.findMany({
      include: {
        projects: true,
        leaders: true,
        users: {
          select: {
            id: true,
          },
        },
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

  async deleteUniversity(universityId: string) {
    const uni = await this.prisma.university.findUnique({
      where: {
        id: universityId,
      },
    });

    if (!uni) {
      throw new NotFoundException('University to delete not found');
    }

    return this.prisma.$transaction([
      this.prisma.project.deleteMany({
        where: {
          leader: {
            universityId: universityId,
          },
          leadingUniversityId: universityId,
        },
      }),
      this.prisma.leader.deleteMany({
        where: {
          universityId: universityId,
        },
      }),
      this.prisma.university.delete({
        where: {
          id: universityId,
        },
      }),
    ]);
  }

  async deleteManyUniversities(body: DeleteManyUniversitiesDto) {
    const universitiesToDelete = await this.prisma.university.findMany({
      where: {
        id: {
          in: body.universitiesIds,
        },
      },
    });

    if (universitiesToDelete.length !== body.universitiesIds.length) {
      throw new NotFoundException('Some projects to delete not found');
    }
    return this.prisma.$transaction([
      this.prisma.project.deleteMany({
        where: {
          leader: {
            universityId: {
              in: body.universitiesIds,
            },
          },
          leadingUniversityId: {
            in: body.universitiesIds,
          },
        },
      }),

      this.prisma.leader.deleteMany({
        where: {
          universityId: {
            in: body.universitiesIds,
          },
        },
      }),

      this.prisma.university.deleteMany({
        where: {
          id: {
            in: body.universitiesIds,
          },
        },
      }),
    ]);
  }

  addUniversity(body: NewUniversityDto) {
    return this.prisma.university.create({
      data: {
        name: body.name,
        photoId: body.photoId,
        description: body.description ?? '',
      },
      include: {
        projects: true,
        leaders: true,
        users: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async editUniversity(body: EditUniversityDto, universityId: string) {
    const university = await this.prisma.university.findUnique({
      where: {
        id: universityId,
      },
    });

    if (!university) {
      throw new NotFoundException('University to edit not found');
    }

    if (body.photoId && university.photoId) {
      await this.prisma.upload.delete({
        where: {
          id: university.photoId,
        },
      });
    }

    return this.prisma.university.update({
      where: {
        id: universityId,
      },
      data: {
        name: body.name,
        description: body.description,
        photoId: body.photoId ?? university.photoId,
      },
      include: {
        projects: true,
        leaders: true,
        users: {
          select: {
            id: true,
          },
        },
      },
    });
  }
}
