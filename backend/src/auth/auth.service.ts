import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { RegisterDTO } from './DTOs/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOneByUsername(username);

    if (!user || !this.passwordService.verifyPassword(pass, user.password))
      throw new UnauthorizedException();

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(registerDTO: RegisterDTO) {
    const password = this.passwordService.hashPassword(registerDTO.password);

    return this.usersService.create({
      ...registerDTO,
      password,
    });
  }
}
