import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectsService } from './projects.service';
import { User } from '../decorators/user.decorator';
import { UserFromReq } from '../users/users.controller';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  getProjects(@User() user: UserFromReq) {
    return this.projectsService.getAllProjects(user.sub);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getProject(@Param() param: { id: string }) {
    return this.projectsService.getProject(param.id);
  }
}
