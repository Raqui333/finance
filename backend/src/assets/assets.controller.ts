import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an asset' })
  @ApiResponse({
    status: 200,
    description: 'Succefully created an asset',
  })
  createAssets(@Body() createAssetDTO: Prisma.assetsCreateInput) {
    return this.assetsService.create(createAssetDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assets' })
  @ApiResponse({
    status: 200,
    description: 'Succefully returned all assets',
  })
  findAll() {
    return this.assetsService.findAll();
  }

  @Get('/from/:id')
  @ApiOperation({ summary: 'Get all assets from a user' })
  @ApiResponse({
    status: 200,
    description: 'Succefully returned all assets',
  })
  findAllFromUser(@Param('id') id: number) {
    return this.assetsService.findAllFromUser(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one asset by id' })
  @ApiResponse({
    status: 200,
    description: 'Succefully returned an asset',
  })
  findOne(@Param('id') id: number) {
    return this.assetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one asset' })
  @ApiResponse({
    status: 200,
    description: 'Succefully updated an asset',
  })
  update(
    @Param('id') id: number,
    @Body() updateAssetDTO: Prisma.assetsUpdateInput
  ) {
    return this.assetsService.update(id, updateAssetDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one asset' })
  @ApiResponse({
    status: 200,
    description: 'Succefully deleted an asset',
  })
  delete(@Param('id') id: number) {
    return this.assetsService.delete(id);
  }
}
