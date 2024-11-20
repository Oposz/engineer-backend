import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddNewProjectDto } from './schemas/addProjectSchema';
import { ApplyToProjectDto } from './schemas/applyToProjectSchema';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getAllProjects(userId: string) {
    const _ = require('lodash');
    const projects = await this.prisma.project.findMany({
      where: {
        NOT: {
          signedUsers: {
            some: {
              id: userId,
            },
          },
        },
      },
      include: {
        signedUsers: true,
      },
    });

    return projects.map((project) => {
      return {
        ...project,
        signedUsers: project.signedUsers.map((user) =>
          _.omit(user, ['password']),
        ),
      };
    });
  }

  getProject(projectId: string) {
    return this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        signedUsers: {
          select: {
            id: true,
            lastName: true,
            name: true,
          },
        },
        definedPositions: true,
        takenPositions: true,
        leader: {
          select: {
            name: true,
            lastName: true,
            title: true,
          },
        },
        sponsors: true,
      },
    });
  }

  async toggleIsProjectFavourite(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        favourite: !project.favourite,
      },
    });
  }

  async addNewProject(body: AddNewProjectDto) {
    const uploadsIds = [
      body.photo,
      ...body.sponsors.map((sponsor) => sponsor.photo),
    ];

    const dbUploadedFiles = await this.prisma.upload.findMany({
      where: {
        id: { in: uploadsIds },
      },
    });

    if (dbUploadedFiles.length !== uploadsIds.length) {
      throw new BadRequestException('Invalid upload ids');
    }

    return this.prisma.project.create({
      data: {
        name: body.projectName,
        description: body.description,
        availableSlots: body.positions.reduce(
          (sum, pos) => sum + pos.quantity,
          0,
        ),
        definedPositions: {
          createMany: {
            data: body.positions.map((position) => ({
              name: position.name,
              quantity: position.quantity,
            })),
          },
        },
        dueTo: new Date(body.dueTo),
        favourite: false,
        photoId: body.photo,
        leadingUniversityId: body.university,
        leaderId: body.leader,
        sponsors: {
          createMany: {
            data: body.sponsors.map((sponsor) => ({
              name: sponsor.name,
              photoId: sponsor.photo,
              description: sponsor.description,
            })),
          },
        },
      },
    });
  }

  async connectUserToProject(body: ApplyToProjectDto, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: body.projectId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: {
        id: body.projectId,
      },
      data: {
        signedUsers: {
          connect: {
            id: userId,
          },
        },
        takenPositions: {
          create: {
            userId: userId,
            definedPositionId: body.id,
          },
        },
      },
      include: {
        signedUsers: {
          select: {
            id: true,
            lastName: true,
            name: true,
          },
        },
        definedPositions: true,
        takenPositions: true,
        leader: {
          select: {
            name: true,
            lastName: true,
            title: true,
          },
        },
        sponsors: true,
      },
    });
  }
}
