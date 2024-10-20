import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signInDto';
import { AuthGuard } from './auth.guard';
import { RegisterDto } from './dto/registerDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInData: SignInDto) {
    return this.authService.signIn(signInData.email, signInData.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerData: RegisterDto) {
    return this.authService.register(registerData);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
