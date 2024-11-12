import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UniversitiesModule } from './universities/universities.module';
import { ProjectsModule } from './projects/projects.module';
import { LeadersModule } from './leaders/leaders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    UniversitiesModule,
    PrismaModule,
    ProjectsModule,
    LeadersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
