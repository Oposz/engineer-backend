import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { User } from '../decorators/user.decorator';
import {
  ConnectUniversityDto,
  connectUniversitySchema,
} from './schemas/connectUniversity';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';

export interface UserFromReq {
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('connect-university')
  connectUniversity(
    @Body(new ZodValidationPipe(connectUniversitySchema))
    formData: ConnectUniversityDto,
    @User() user: UserFromReq,
  ) {
    return this.usersService.connectUniversity(formData.universityId, user.sub);
  }
}
