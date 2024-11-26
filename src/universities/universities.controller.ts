import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('universities')
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @Get()
  getUniversities() {
    return this.universitiesService.getUniversities();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUniversity(@Param() param: { id: string }) {
    return this.universitiesService.getUniversity(param.id);
  }

  @UseGuards(AuthGuard)
  @Patch('favourite/:id')
  toggleUniversityFav(@Param('id') param: string) {
    return this.universitiesService.toggleUniversityFav(param);
  }
}
