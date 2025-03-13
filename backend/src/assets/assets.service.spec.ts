import { Test } from '@nestjs/testing';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

// mocks
import { Prisma } from '@prisma/client';
import { DatabaseService } from '@/database/database.service';

const USER_ID = 1;

const createAssetDTO = {
  date: new Date('01/01/2025'),
  name: 'Asset Name',
  description: 'Asset Description',
  price: new Prisma.Decimal(99.99),
  users: USER_ID as Prisma.usersCreateNestedOneWithoutAssetsInput,
};

const virtual_db = [
  {
    id: 1,
    date: new Date('01/01/2025'),
    name: 'Asset One',
    description: 'First asset description',
    price: new Prisma.Decimal(15.5),
    holder_id: USER_ID,
  },
  {
    id: 2,
    date: new Date('01/02/2025'),
    name: 'Asset Two',
    description: 'Second asset description',
    price: new Prisma.Decimal(25.0),
    holder_id: 2, // another user
  },
  {
    id: 3,
    date: new Date('01/03/2025'),
    name: 'Asset Three',
    description: 'Third asset description',
    price: new Prisma.Decimal(30.5),
    holder_id: USER_ID,
  },
];

describe('AssetsService', () => {
  let service: AssetsService;
  let database: DatabaseService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AssetsService, DatabaseService],
    }).compile();

    service = moduleRef.get(AssetsService);
    database = moduleRef.get(DatabaseService);

    const mockedFindUnique = jest.fn().mockImplementation(async ({ where }) => {
      return virtual_db.find((asset) => asset.holder_id === where.id);
    });

    jest
      .spyOn(database.assets, 'findUnique')
      .mockImplementation(mockedFindUnique);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    afterEach(() => {
      expect(database.assets.create).toHaveBeenCalledTimes(1);
    });

    it('Should successfully create an asset', async () => {
      jest.spyOn(database.assets, 'create').mockResolvedValue(virtual_db[0]);

      const result = await service.create(createAssetDTO);

      expect(result.asset).toBeDefined();
      expect(result.asset).toHaveProperty('id');
      expect(result.asset).toHaveProperty('date');
      expect(result.asset).toHaveProperty('name');
      expect(result.asset).toHaveProperty('price');
      expect(result.asset).toHaveProperty('description');
      expect(result.asset).toHaveProperty('holder_id');
      expect(typeof result.asset.price).toBe('number');
    });

    it('Should fail to create an asset', async () => {
      jest
        .spyOn(database.assets, 'create')
        .mockRejectedValue(new Error('Mocking error'));

      try {
        await service.create(createAssetDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('read()', () => {
    afterAll(() => {
      expect(database.assets.findMany).toHaveBeenCalledTimes(1);
    });

    it('Should return all assets from an user', async () => {
      const mockReturn = () => {
        return virtual_db.filter((asset) => asset.holder_id === USER_ID);
      };

      jest.spyOn(database.assets, 'findMany').mockResolvedValue(mockReturn());

      const result = await service.read(USER_ID);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].holder_id).toBe(USER_ID);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('price');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('holder_id');
      expect(typeof result[0].price).toBe('number');
    });

    it('Should not found any asset', async () => {
      const nonExistentUser = 3;
      const mockReturn = () => {
        return virtual_db.filter(
          (asset) => asset.holder_id === nonExistentUser
        );
      };

      jest.spyOn(database.assets, 'findMany').mockResolvedValue(mockReturn());

      try {
        await service.read(nonExistentUser);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('findOne()', () => {
    afterEach(() => {
      expect(database.assets.findUnique).toHaveBeenCalledTimes(1);
    });

    it('Should successfully return one asset', async () => {
      const result = await service.findOne(USER_ID);

      expect(database.assets.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('holder_id');
      expect(typeof result.price).toBe('number');
    });

    it('Should not found an asset', async () => {
      const nonExistentUser = 3;
      try {
        await service.findOne(nonExistentUser);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update()', () => {
    it('Should successfully update an asset', async () => {
      const asset_to_update = 1;

      const updateAssetDTO = {
        name: 'Asset One Eddited',
      };

      jest.spyOn(database.assets, 'update').mockResolvedValue({
        ...virtual_db[0],
        name: updateAssetDTO.name,
      });

      jest.spyOn(service, 'findOne');

      const result = await service.update(
        asset_to_update,
        updateAssetDTO,
        USER_ID
      );

      expect(database.assets.update).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result.asset_id).toBe(asset_to_update);
    });

    it('Should prevent user to update the asset id', async () => {
      const asset_to_update = 1;

      const updateAssetDTO = {
        id: 2,
      };

      jest.spyOn(database.assets, 'update');
      jest.spyOn(service, 'findOne');

      try {
        await service.update(
          asset_to_update,
          updateAssetDTO as any, // should throw error
          USER_ID
        );
      } catch (error) {
        expect(database.assets.update).toHaveBeenCalledTimes(0);
        expect(service.findOne).toHaveBeenCalledTimes(0);
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('Should prevent user of update assets from another user', async () => {
      const asset_to_update = 2; // from another user

      const updateAssetDTO = {
        name: 'Asset Two Eddited',
      };

      jest.spyOn(database.assets, 'update');
      jest.spyOn(service, 'findOne');

      try {
        await service.update(asset_to_update, updateAssetDTO, USER_ID);
      } catch (error) {
        expect(database.assets.update).toHaveBeenCalledTimes(0);
        expect(service.findOne).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('Should not found any asset', async () => {
      const asset_to_update = 3; // Non-existent asset

      const updateAssetDTO = {
        name: 'Asset Non-existent Eddited',
      };

      jest.spyOn(service, 'findOne');

      try {
        await service.update(asset_to_update, updateAssetDTO, USER_ID);
      } catch (error) {
        expect(service.findOne).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete()', () => {
    it('Should successfully remove an asset', async () => {
      const asset_to_delete = 1;

      jest.spyOn(database.assets, 'delete').mockResolvedValue(virtual_db[0]);
      jest.spyOn(service, 'findOne');

      const result = await service.delete(asset_to_delete, USER_ID);

      expect(result).toBeDefined();
      expect(result.asset_id).toBe(asset_to_delete);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(database.assets.delete).toHaveBeenCalledTimes(1);
    });

    it('Should prevent user of remove assets from another user', async () => {
      const asset_to_delete = 2; // from another user

      jest.spyOn(database.assets, 'delete');
      jest.spyOn(service, 'findOne');

      try {
        await service.delete(asset_to_delete, USER_ID);
      } catch (error) {
        expect(service.findOne).toHaveBeenCalledTimes(1);
        expect(database.assets.delete).toHaveBeenCalledTimes(0);
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
