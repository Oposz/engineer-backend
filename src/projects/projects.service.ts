import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
