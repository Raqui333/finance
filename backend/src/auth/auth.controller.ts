import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@/decorators/public.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignInDTO } from './DTOs/login.dto';
import { RegisterDTO } from './DTOs/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Succefully log in',
  })
  signIn(@Body() signInDTO: SignInDTO) {
    return this.authService.signIn(signInDTO.username, signInDTO.password);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register an user' })
  @ApiResponse({
    status: 200,
    description: 'Succefully registered an user',
  })
  signUp(@Body() RegisterDTO: RegisterDTO) {
    return this.authService.signUp(RegisterDTO);
  }
}
