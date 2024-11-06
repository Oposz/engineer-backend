import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getAllProjects() {
    const _ = require('lodash');
    const projects = await this.prisma.project.findMany({
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
}
