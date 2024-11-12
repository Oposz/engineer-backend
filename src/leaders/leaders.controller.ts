import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { LeadersService } from './leaders.service';

@Controller('leaders')
export class LeadersController {
  constructor(private leadersService: LeadersService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAllLeaders() {
    return this.leadersService.getAllLeaders();
  }
}
