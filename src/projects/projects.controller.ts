import {
  Body,
  Controller,
  Delete,
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
import {
  ApplyToProjectDto,
  applyToProjectSchema,
} from './schemas/applyToProjectSchema';
import {
  AbandonProjectDto,
  abandonProjectSchema,
} from './schemas/abandonProjectSchema';
import {
  DeleteManyProjectsDto,
  deleteManyProjectsSchema,
} from './schemas/deleteManyProjectsSchema';
import {
  UpdateProjectDto,
  updateProjectSchema,
} from './schemas/updateProjectSchema';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  getProjects() {
    return this.projectsService.getAllProjects();
  }

  @UseGuards(AuthGuard)
  @Get('available')
  getAvailableProjects(@User() user: UserFromReq) {
    return this.projectsService.getAllProjectsExcludingMine(user.sub);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getProject(@Param('id') param: string) {
    return this.projectsService.getProject(param);
  }

  @UseGuards(AuthGuard)
  @Post('add')
  @UsePipes(new ZodValidationPipe(addNewProjectSchema))
  addNewProject(@Body() body: AddNewProjectDto) {
    return this.projectsService.addNewProject(body);
  }

  @UseGuards(AuthGuard)
  @Patch('edit/:id')
  editProject(
    @Body(new ZodValidationPipe(updateProjectSchema)) body: UpdateProjectDto,
    @Param('id') param: string,
  ) {
    return this.projectsService.editProject(body, param);
  }

  @UseGuards(AuthGuard)
  @Patch('apply')
  connectUserToProject(
    @Body(new ZodValidationPipe(applyToProjectSchema)) body: ApplyToProjectDto,
    @User() user: UserFromReq,
  ) {
    return this.projectsService.connectUserToProject(body, user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('abandon')
  disconnectUserFromProject(
    @Body(new ZodValidationPipe(abandonProjectSchema)) body: AbandonProjectDto,
    @User() user: UserFromReq,
  ) {
    return this.projectsService.disconnectUserFromProject(body, user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  deleteProject(@Param('id') param: string) {
    return this.projectsService.deleteProject(param);
  }

  @UseGuards(AuthGuard)
  @Patch('delete-many')
  deleteManyProject(
    @Body(new ZodValidationPipe(deleteManyProjectsSchema))
    body: DeleteManyProjectsDto,
  ) {
    return this.projectsService.deleteManyProjects(body);
  }
}
