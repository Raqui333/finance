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
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an user' })
  @ApiResponse({
    status: 200,
    description: 'Succefully created an user',
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
  @ApiParam({ name: 'id', type: String, description: 'user ID' })
  @ApiResponse({
    status: 200,
    description: 'Succefully returned an user',
  })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an user' })
  @ApiParam({ name: 'id', type: String, description: 'user ID' })
  @ApiResponse({
    status: 200,
    description: 'Succefully updated an user',
  })
  update(
    @Param('id') id: number,
    @Body() updateUserDTO: Prisma.usersUpdateInput
  ) {
    return this.usersService.update(id, updateUserDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an user' })
  @ApiParam({ name: 'id', type: String, description: 'user ID' })
  @ApiResponse({
    status: 200,
    description: 'Succefully deleted an user',
  })
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
