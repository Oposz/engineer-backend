import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Patch('favourite/:id')
  toggleUniversityFav(@Param('id') param: string) {
    return this.leadersService.toggleLeaderFav(param);
  }
}
