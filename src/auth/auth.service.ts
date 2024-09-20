import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, _password: string): Promise<any> {
    const user = await this.usersService.findOne(email, _password);
    if (user?.password !== _password) {
      throw new UnauthorizedException();
    }
    const jwtPayload = {
      sub: user.id,
      username: user.name,
      userLastName: user.lastName,
    };
    return {
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }
}
