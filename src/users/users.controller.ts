import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { User } from '../decorators/user.decorator';

interface UserFromReq {
  sub: number;
  username: string;
  userLastName: string;
  email: string;
  iat: number;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@User() user: UserFromReq) {
    return this.usersService.getCurrentUser(user.sub);
  }
}
