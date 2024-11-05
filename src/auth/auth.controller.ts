import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, signInSchema } from './schemas/signInDto';
import { RegisterDto, registerSchema } from './schemas/registerDto';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';
import { AuthGuard } from './auth.guard';
import { ChangeEmailDto, changeEmailSchema } from './schemas/changeEmailSchema';
import { User } from '../decorators/user.decorator';
import { UserFromReq } from '../users/users.controller';
import {
  ChangePasswordDto,
  changePasswordSchema,
} from './schemas/changePasswordSchema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipe(signInSchema))
  signIn(@Body() signInData: SignInDto) {
    return this.authService.signIn(signInData.email, signInData.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  register(@Body() registerData: RegisterDto) {
    return this.authService.register(registerData);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('change-email')
  changeEmail(
    @Body(new ZodValidationPipe(changeEmailSchema)) formData: ChangeEmailDto,
    @User() user: UserFromReq,
  ) {
    return this.authService.changeEmail(user.sub, formData);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  changePassword(
    @Body(new ZodValidationPipe(changePasswordSchema))
    formData: ChangePasswordDto,
    @User() user: UserFromReq,
  ) {
    return this.authService.changePassword(user.sub, formData);
  }
}
