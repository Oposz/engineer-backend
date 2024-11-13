import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
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
  getProject(@Param() param: { projectId: string }) {
    return this.projectsService.getProject(param.projectId);
  }

  @UseGuards(AuthGuard)
  @Patch('favourite/:id')
  toggleIsProjectFavourite(@Param('id') param: string) {
    return this.projectsService.toggleIsProjectFavourite(param);
  }
}
