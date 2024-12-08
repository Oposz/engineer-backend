import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeleteManyLeadersDto } from './schemas/deleteManyLeadersSchema';
import { AddNewLeadersDto } from './schemas/addNewLeaderSchema';

@Injectable()
export class LeadersService {
  constructor(private prisma: PrismaService) {}

  getAllLeaders() {
    return this.prisma.leader.findMany({
      include: {
        university: true,
      },
    });
  }

  getAllDetailedLeaders() {
    return this.prisma.leader.findMany({
      include: {
        university: true,
        projects: {
          include: {
            signedUsers: {
              select: { id: true },
            },
          },
        },
      },
    });
  }

  async deleteLeader(leaderId: string) {
    const leader = await this.prisma.leader.findUnique({
      where: {
        id: leaderId,
      },
    });

    if (!leader) {
      throw new NotFoundException('Leader to delete not found');
    }

    return this.prisma.$transaction([
      this.prisma.project.deleteMany({
        where: {
          leaderId: leaderId,
        },
      }),
      this.prisma.leader.delete({
        where: {
          id: leaderId,
        },
      }),
    ]);
  }

  async deleteManyLeaders(body: DeleteManyLeadersDto) {
    const leadersToDelete = await this.prisma.leader.findMany({
      where: {
        id: {
          in: body.leadersIds,
        },
      },
    });

    if (leadersToDelete.length !== body.leadersIds.length) {
      throw new NotFoundException('Some leaders to delete not found');
    }

    return this.prisma.$transaction([
      this.prisma.project.deleteMany({
        where: {
          leaderId: {
            in: body.leadersIds,
          },
        },
      }),

      this.prisma.leader.deleteMany({
        where: {
          id: {
            in: body.leadersIds,
          },
        },
      }),
    ]);
  }

  async addNewLeader(body: AddNewLeadersDto) {
    const universityToConnect = await this.prisma.university.findUnique({
      where: {
        id: body.university,
      },
    });

    if (!universityToConnect) {
      throw new NotFoundException('Incorrect university id');
    }

    const data: any = {
      email: body.email,
      universityId: body.university,
      department: body.department,
      lastName: body.lastName,
      name: body.name,
      phoneNumber: body.phone,
      title: body.title,
    };

    if (body.photoId) {
      data.photoId = body.photoId;
    }

    return this.prisma.leader.create({
      data,
      include: {
        university: true,
        projects: {
          include: {
            signedUsers: {
              select: { id: true },
            },
          },
        },
      },
    });
  }

  async editLeader(body: AddNewLeadersDto, leaderId: string) {
    const leader = await this.prisma.leader.findUnique({
      where: {
        id: leaderId,
      },
    });

    if (!leader) {
      throw new NotFoundException('Leader not found');
    }

    if (body.photoId && leader.photoId) {
      await this.prisma.upload.delete({
        where: {
          id: body.photoId,
        },
      });
    }

    return this.prisma.leader.update({
      where: {
        id: leaderId,
      },
      data: {
        email: body.email,
        universityId: body.university,
        department: body.department,
        lastName: body.lastName,
        name: body.name,
        phoneNumber: body.phone,
        title: body.title,
        photoId: body.photoId ?? leader.photoId,
      },
      include: {
        university: true,
        projects: {
          include: {
            signedUsers: {
              select: { id: true },
            },
          },
        },
      },
    });
  }
}
