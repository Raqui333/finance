import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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
  create(
    @Body() createAssetDTO: Prisma.assetsCreateInput,
    @Req() req: JwtRequest
  ) {
    return this.assetsService.create({
      ...createAssetDTO,

      // holder_id set to the user id of the request
      users: { connect: { id: req.user.sub } },
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all assets from the user' })
  @ApiResponse({
    status: 200,
    description: 'Succefully returned all assets',
  })
  read(@Req() req: JwtRequest) {
    return this.assetsService.read(req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an asset' })
  @ApiResponse({
    status: 200,
    description: 'Succefully updated an asset',
  })
  update(
    @Param('id') id: number,
    @Req() req: JwtRequest,
    @Body() updateAssetDTO: Prisma.assetsUpdateInput
  ) {
    return this.assetsService.update(id, updateAssetDTO, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an asset' })
  @ApiResponse({
    status: 200,
    description: 'Succefully deleted an asset',
  })
  delete(@Param('id') id: number, @Req() req: JwtRequest) {
    return this.assetsService.delete(id, req.user.sub);
  }
}
