import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddNewProjectDto } from './schemas/addProjectSchema';
import { ApplyToProjectDto } from './schemas/applyToProjectSchema';
import { AbandonProjectDto } from './schemas/abandonProjectSchema';
import { DeleteManyProjectsDto } from './schemas/deleteManyProjectsSchema';
import { UpdateProjectDto } from './schemas/updateProjectSchema';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getAllProjects() {
    const _ = require('lodash');
    const projects = await this.prisma.project.findMany({
      include: {
        signedUsers: true,
        leadingUniversity: true,
        leader: true,
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

  async getAllProjectsExcludingMine(userId: string) {
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
            id: true,
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
        dueTo: body.dueTo,
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

  async disconnectUserFromProject(body: AbandonProjectDto, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: body.projectId,
      },
    });

    const userToDisconnect = await this.prisma.user.findUnique({
      where: {
        id: userId,
        projects: {
          some: {
            id: body.projectId,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!userToDisconnect) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.project.update({
      where: {
        id: body.projectId,
      },
      data: {
        signedUsers: {
          disconnect: {
            id: userId,
          },
        },
        takenPositions: {
          deleteMany: {
            projectId: body.projectId,
            userId: userId,
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

  async deleteProject(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      throw new NotFoundException('Project to delete not found');
    }
    return this.prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  }

  async deleteManyProjects(requestBody: DeleteManyProjectsDto) {
    const projectsToDelete = await this.prisma.project.findMany({
      where: {
        id: {
          in: requestBody.projectIds,
        },
      },
    });

    if (projectsToDelete.length !== requestBody.projectIds.length) {
      throw new NotFoundException('Some projects to delete not found');
    }

    return this.prisma.project.deleteMany({
      where: {
        id: {
          in: requestBody.projectIds,
        },
      },
    });
  }

  async editProject(body: UpdateProjectDto, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const positionToAdd = body.positions.filter((position) => !position.id);
    const positionsToDeleteIds = body.positionsToDelete.map(
      (position) => position.id,
    );

    const sponsorsToDeleteIds = body.deletedSponsors.map((sponsor) => {
      if (!sponsor) return '';
      return sponsor.id;
    });

    const updateData: any = {
      name: body.projectName,
      description: body.description,
      availableSlots: body.positions.reduce(
        (sum, pos) => sum + pos.quantity,
        0,
      ),
      dueTo: body.dueTo,
      photoId: body.photo || project.photoId,
      leadingUniversityId: body.university,
      leaderId: body.leader,
    };

    if (positionToAdd.length > 0) {
      updateData.definedPositions = {
        createMany: {
          data: positionToAdd.map((position) => ({
            name: position.name,
            quantity: position.quantity,
          })),
        },
      };
    }

    if (positionsToDeleteIds.length > 0) {
      updateData.definedPositions = {
        ...updateData.definedPositions,
        deleteMany: {
          id: {
            in: positionsToDeleteIds,
          },
        },
      };
    }

    if (body.sponsors.length > 0) {
      const sponsorsToCreate = body.sponsors.filter((sponsor) => !sponsor!.id);

      if (sponsorsToCreate.length > 0) {
        updateData.sponsors = {
          createMany: {
            data: sponsorsToCreate.map((sponsor) => ({
              name: sponsor!.name,
              photoId: sponsor!.photo,
              description: sponsor!.description,
            })),
          },
        };
      }
    }

    if (sponsorsToDeleteIds.length > 0) {
      updateData.sponsors = {
        ...updateData.sponsors,
        deleteMany: {
          id: {
            in: sponsorsToDeleteIds,
          },
        },
      };
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });
  }
}
