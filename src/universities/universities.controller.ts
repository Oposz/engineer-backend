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
import { UniversitiesService } from './universities.service';
import { AuthGuard } from '../auth/auth.guard';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';
import {
  DeleteManyProjectsDto,
  deleteManyProjectsSchema,
} from '../projects/schemas/deleteManyProjectsSchema';
import {
  DeleteManyUniversitiesDto,
  deleteManyUniversitiesSchema,
} from './schema/deleteManyUniversitiesSchema';
import {
  NewUniversityDto,
  newUniversitySchema,
} from './schema/newUniversitySchema';
import {
  EditUniversityDto,
  editUniversitySchema,
} from './schema/editUniversitySchema';

@Controller('universities')
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @Get()
  getUniversities() {
    return this.universitiesService.getUniversities();
  }

  @Get('detailed')
  getUniversitiesWithDetails() {
    return this.universitiesService.getUniversitiesWithDetails();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUniversity(@Param() param: { id: string }) {
    return this.universitiesService.getUniversity(param.id);
  }

  @UseGuards(AuthGuard)
  @Post('new')
  @UsePipes(new ZodValidationPipe(newUniversitySchema))
  addUniversity(@Body() body: NewUniversityDto) {
    return this.universitiesService.addUniversity(body);
  }

  @UseGuards(AuthGuard)
  @Patch('edit/:id')
  editUniversity(
    @Body(new ZodValidationPipe(editUniversitySchema)) body: EditUniversityDto,
    @Param('id') param: string,
  ) {
    return this.universitiesService.editUniversity(body, param);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  deleteUniversity(@Param('id') param: string) {
    return this.universitiesService.deleteUniversity(param);
  }

  @UseGuards(AuthGuard)
  @Patch('delete-many')
  deleteManyUniversities(
    @Body(new ZodValidationPipe(deleteManyUniversitiesSchema))
    body: DeleteManyUniversitiesDto,
  ) {
    return this.universitiesService.deleteManyUniversities(body);
  }
}
