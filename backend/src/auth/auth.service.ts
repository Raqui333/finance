import { DatabaseService } from '@/database/database.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.databaseService.users.findUnique({
      where: { username },
    });

    if (!user || !this.passwordService.verifyPassword(pass, user.password))
      throw new UnauthorizedException();

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
