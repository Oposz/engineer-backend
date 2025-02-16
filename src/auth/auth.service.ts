import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './schemas/registerDto';
import { CreateJwtPayload } from '../utils/createJwtPayload';
import { ChangeEmailDto } from './schemas/changeEmailSchema';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './schemas/changePasswordSchema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signIn(email: string, _password: string) {
    const user = await this.usersService.findOneByCredentials(email);
    const isMatch = await bcrypt.compare(_password, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return {
      access_token: await this.jwtService.signAsync(CreateJwtPayload(user!)),
    };
  }

  async register(registerData: RegisterDto) {
    const createdUser = await this.usersService.createOne(registerData);

    return {
      access_token: await this.jwtService.signAsync(
        CreateJwtPayload(createdUser),
      ),
    };
  }

  async changeEmail(userId: string, formData: ChangeEmailDto) {
    const password = await this.getUserPassword(userId);

    if (password?.password !== formData.password) {
      throw new UnauthorizedException();
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: formData.newEmail,
      },
    });

    return {
      access_token: await this.jwtService.signAsync(
        CreateJwtPayload(updatedUser),
      ),
    };
  }

  async changePassword(userId: string, formData: ChangePasswordDto) {
    const password = await this.getUserPassword(userId);

    if (password?.password !== formData.password) {
      throw new UnauthorizedException();
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: formData.newPassword,
      },
    });

    return {
      access_token: await this.jwtService.signAsync(
        CreateJwtPayload(updatedUser),
      ),
    };
  }

  private async getUserPassword(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });
  }
}
