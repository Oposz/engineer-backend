import { Controller, Get, Param } from '@nestjs/common';
import { UniversitiesService } from './universities.service';

@Controller('universities')
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @Get()
  getUniversities() {
    return this.universitiesService.getUniversities();
  }

  @Get(':id')
  getUniversity(@Param() param: { id: string }) {
    return this.universitiesService.getUniversity(param.id);
  }
}
