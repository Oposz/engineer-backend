import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/registerDto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, _password: string) {
    const user = await this.usersService.findOneByCredentials(email, _password);
    if (user?.password !== _password) {
      throw new UnauthorizedException();
    }

    return {
      access_token: await this.jwtService.signAsync(this.createPayload(user)),
    };
  }

  async register(registerData: RegisterDto) {
    const createdUser = await this.usersService.createOne(registerData);

    return {
      access_token: await this.jwtService.signAsync(
        this.createPayload(createdUser),
      ),
    };
  }

  private createPayload(user: User) {
    return {
      sub: user.id,
      username: user.name,
      userLastName: user.lastName,
      email: user.email,
    };
  }
}
