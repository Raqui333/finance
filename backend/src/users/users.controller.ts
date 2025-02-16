import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 200,
    description: 'Succefully created a user',
  })
  createUser(@Body() createUserDTO: Prisma.usersCreateInput) {
    return this.usersService.create(createUserDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Succefully returned all users',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user' })
  @ApiResponse({
    status: 200,
    description: 'Succefully returned a user',
  })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one user' })
  @ApiResponse({
    status: 200,
    description: 'Succefully updated a user',
  })
  update(
    @Param('id') id: number,
    @Body() updateUserDTO: Prisma.usersUpdateInput
  ) {
    return this.usersService.update(id, updateUserDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one user' })
  @ApiResponse({
    status: 200,
    description: 'Succefully deleted a user',
  })
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
