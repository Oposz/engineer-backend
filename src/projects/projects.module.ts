import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ProjectsService, JwtService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
