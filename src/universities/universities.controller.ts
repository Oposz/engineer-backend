import { Controller, Get } from '@nestjs/common';
import { UniversitiesService } from './universities.service';

@Controller('universities')
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @Get()
  getUniversities() {
    return this.universitiesService.getUniversities();
  }
}
