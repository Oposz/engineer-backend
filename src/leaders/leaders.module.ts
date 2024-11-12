import { Module } from '@nestjs/common';
import { LeadersController } from './leaders.controller';
import { LeadersService } from './leaders.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [LeadersController],
  providers: [LeadersService, JwtService],
})
export class LeadersModule {}
