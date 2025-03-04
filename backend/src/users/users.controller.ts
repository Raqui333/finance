import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

interface JwtRequest extends Request {
  user: {
    sub: number;
    username: string;
    iat: number;
    exp: number;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get info from the user' })
  @ApiResponse({
    status: 200,
    description: 'Succefully returned user info',
  })
  read(@Req() req: JwtRequest) {
    return this.usersService.read(req.user.sub);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user info' })
  @ApiResponse({
    status: 200,
    description: 'Succefully updated the user info',
  })
  update(
    @Req() req: JwtRequest,
    @Body() updateUserDTO: Prisma.usersUpdateInput
  ) {
    return this.usersService.update(req.user.sub, updateUserDTO);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'Succefully deleted an user',
  })
  delete(@Req() req: JwtRequest) {
    return this.usersService.delete(req.user.sub);
  }
}
