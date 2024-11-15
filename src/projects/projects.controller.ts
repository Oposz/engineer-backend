import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectsService } from './projects.service';
import { User } from '../decorators/user.decorator';
import { UserFromReq } from '../users/users.controller';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';
import {
  AddNewProjectDto,
  addNewProjectSchema,
} from './schemas/addProjectSchema';

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
  getProject(@Param('id') param: string) {
    return this.projectsService.getProject(param);
  }

  @UseGuards(AuthGuard)
  @Patch('favourite/:id')
  toggleIsProjectFavourite(@Param('id') param: string) {
    return this.projectsService.toggleIsProjectFavourite(param);
  }

  @UseGuards(AuthGuard)
  @Post('add')
  @UsePipes(new ZodValidationPipe(addNewProjectSchema))
  addNewProject(@Body() body: AddNewProjectDto) {
    return this.projectsService.addNewProject(body);
  }
}
