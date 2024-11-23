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
  sub: string;
  username: string;
  userLastName: string;
  email: string;
  iat: number;
}

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  getProfile(@User() user: UserFromReq) {
    return this.usersService.getCurrentUser(user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get('universities')
  getUniversities(@User() user: UserFromReq) {
    return this.usersService.getUserUniversities(user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('teams')
  getTeams(@User() user: UserFromReq) {
    return this.usersService.getUserTeams(user.sub);
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
