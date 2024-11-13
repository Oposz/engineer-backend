import { Module } from '@nestjs/common';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [UniversitiesController],
  providers: [UniversitiesService, JwtService],
})
export class UniversitiesModule {}
