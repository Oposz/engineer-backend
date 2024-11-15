import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddNewProjectDto } from './schemas/addProjectSchema';

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
      throw new NotFoundException();
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

  addNewProject(body: AddNewProjectDto) {
    // TODO implement add new project functionality
    // return this.prisma.project.create({
    //   data: {body},
    // });
  }
}
