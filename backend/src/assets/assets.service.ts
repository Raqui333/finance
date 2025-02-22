import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssetsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createAssetDTO: Prisma.assetsCreateInput) {
    try {
      const { id } = await this.databaseService.assets.create({
        data: createAssetDTO,
      });

      return { message: 'Succefully created an asset', asset_id: id };
    } catch (err) {
      throw new BadRequestException('Failed to create asset');
    }
  }

  async findAll() {
    const assets = await this.databaseService.assets.findMany();

    if (!assets.length) throw new NotFoundException('No assets found');

    return assets;
  }

  async findOne(id: number) {
    const asset = await this.databaseService.assets.findUnique({
      where: { id },
    });

    if (!asset) throw new NotFoundException('Asset not found');

    return asset;
  }

  async update(id: number, updateAssetDTO: Prisma.assetsUpdateInput) {
    if ('id' in updateAssetDTO) {
      // this is to prevent updating the id
      throw new BadRequestException('ID cannot be updated');
    }

    await this.findOne(id);

    const updated_asset = await this.databaseService.assets.update({
      where: { id },
      data: updateAssetDTO,
    });

    if (!updated_asset) throw new NotFoundException('Failed to update asset');

    return {
      message: 'Succefully updated an asset',
      asset_id: updated_asset.id,
    };
  }

  async delete(id: number) {
    await this.findOne(id);

    await this.databaseService.assets.delete({ where: { id } });

    return { message: 'Succefully deleted an asset', asset_id: id };
  }
}
