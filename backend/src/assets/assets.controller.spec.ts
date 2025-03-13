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

const token = {
  user: { sub: USER_ID, username: 'username', iat: 0, exp: 1 },
} as JwtRequest;

const request = {
  jwt: token,
  body: {
    date: new Date('01/01/2025'),
    name: 'Asset Name',
    description: 'Asset Description',
    price: new Prisma.Decimal(99.99),
    users: USER_ID as Prisma.usersCreateNestedOneWithoutAssetsInput,
  },
};

const virtual_db = [
  {
    id: 1,
    date: new Date('01/01/2025'),
    name: 'Asset One',
    description: 'First asset description',
    price: 15.5,
    holder_id: USER_ID,
  },
  {
    id: 2,
    date: new Date('01/02/2025'),
    name: 'Asset Two',
    description: 'Second asset description',
    price: 25.0,
    holder_id: 2, // another user
  },
  {
    id: 3,
    date: new Date('01/03/2025'),
    name: 'Asset Three',
    description: 'Third asset description',
    price: 30.5,
    holder_id: USER_ID,
  },
];

describe('AssetsController', () => {
  let controller: AssetsController;
  let service: AssetsService;
  let database: DatabaseService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [AssetsService, DatabaseService],
    }).compile();

    controller = moduleRef.get(AssetsController);
    service = moduleRef.get(AssetsService);
    database = moduleRef.get(DatabaseService);

    jest.spyOn(service, 'findOne').mockImplementation(async (id: number) => {
      return virtual_db.find((asset) => asset.id === id)!;
    });

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/assets (POST)', () => {
    it('Should successfully create an asset', async () => {
      const mockAsset = {
        ...request.body,
        id: 1,
        holder_id: request.body.users as number,
      };

      jest.spyOn(service, 'create').mockResolvedValue({
        message: 'Successfully created an asset',
        asset: { ...mockAsset, price: mockAsset.price.toNumber() },
      });

      const result = await controller.create(request.body, request.jwt);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith({
        ...request.body,
        users: { connect: { id: request.jwt.user.sub } },
      });

      expect(result.asset).toBeDefined();
      expect(typeof result.asset.price).toBe('number');
    });

    it('Should fail to create an asset', async () => {
      jest
        .spyOn(database.assets, 'create')
        .mockRejectedValue(new Error('Mocking error'));

      jest.spyOn(service, 'create');

      try {
        await controller.create(request.body, request.jwt);
      } catch (error) {
        expect(service.create).toHaveBeenCalledTimes(1);
        expect(database.assets.create).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('/assets (GET)', () => {
    it('Should successfully return all assets from an user', async () => {
      const assets = virtual_db.filter(
        (asset) => asset.holder_id === request.jwt.user.sub
      );

      jest.spyOn(service, 'read').mockResolvedValue(assets);

      const result = await controller.read(request.jwt);

      expect(service.read).toHaveBeenCalledTimes(1);
      expect(service.read).toHaveBeenCalledWith(USER_ID);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].holder_id).toBe(USER_ID);
    });

    it('Should not found any assets', async () => {
      jest.spyOn(database.assets, 'findMany').mockResolvedValue([
        /* empty array */
      ]);

      jest.spyOn(service, 'read');

      try {
        await controller.read(request.jwt);
      } catch (error) {
        expect(service.read).toHaveBeenCalledTimes(1);
        expect(database.assets.findMany).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('/assets (PATCH)', () => {
    it('Should successfully update an asset', async () => {
      const asset_to_update = 1;

      const updateAssetDTO = {
        name: 'Asset One Edited',
      };

      jest.spyOn(service, 'update').mockResolvedValue({
        message: 'Succefully updated an asset',
        asset_id: asset_to_update,
      });

      const result = await controller.update(
        asset_to_update,
        request.jwt,
        updateAssetDTO
      );

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        asset_to_update,
        updateAssetDTO,
        USER_ID
      );

      expect(result).toBeDefined();
      expect(result.asset_id).toBe(asset_to_update);
    });

    it('Should prevent from update assets id', async () => {
      const asset_to_update = 1;

      const updateAssetDTO = {
        id: 1,
      };

      jest.spyOn(service, 'update');

      try {
        await controller.update(
          asset_to_update,
          request.jwt,
          updateAssetDTO as any // it should cause an error
        );
      } catch (error) {
        expect(service.update).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('Should prevent from update assets from another user', async () => {
      const asset_to_update = 2; // different id from jwt.token

      const updateAssetDTO = {
        name: 'Asset One Edited',
      };

      jest.spyOn(service, 'update');

      try {
        await controller.update(asset_to_update, request.jwt, updateAssetDTO);
      } catch (error) {
        expect(service.update).toHaveBeenCalledTimes(1);
        expect(service.findOne).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('Should not found any asset to update', async () => {
      const asset_to_update = 1;

      const updateAssetDTO = {
        name: 'Non-existent asset',
      };

      jest.spyOn(database.assets, 'update').mockResolvedValue(null as never);

      jest.spyOn(service, 'update');

      try {
        await controller.update(asset_to_update, request.jwt, updateAssetDTO);
      } catch (error) {
        expect(service.update).toHaveBeenCalledTimes(1);
        expect(database.assets.update).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('/assets (DELETE)', () => {
    it('Should successfully delete an asset', async () => {
      const asset_to_delete = 1;

      jest.spyOn(service, 'delete').mockResolvedValue({
        message: 'Succefully deleted an asset',
        asset_id: asset_to_delete,
      });

      const result = await controller.delete(asset_to_delete, request.jwt);

      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(asset_to_delete, USER_ID);

      expect(result).toBeDefined();
      expect(result.asset_id).toBe(asset_to_delete);
    });

    it('Should prevent from delete assets from another user', async () => {
      const asset_to_delete = 2;

      jest.spyOn(service, 'delete');

      try {
        await controller.delete(asset_to_delete, request.jwt);
      } catch (error) {
        expect(service.delete).toHaveBeenCalledTimes(1);
        expect(service.delete).toHaveBeenCalledWith(asset_to_delete, USER_ID);
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
