import { Test } from '@nestjs/testing';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

// mocks
import { Prisma } from '@prisma/client';
import { DatabaseService } from '@/database/database.service';
import { BadRequestException } from '@nestjs/common';

const token = {
  user: { sub: 1, username: 'username', iat: 0, exp: 1 },
} as JwtRequest;

const request = {
  jwt: token,
  body: {
    date: new Date('01/01/2025'),
    name: 'Asset Name',
    description: 'Asset Description',
    price: new Prisma.Decimal(99.99),
    users: 1 as Prisma.usersCreateNestedOneWithoutAssetsInput,
  },
};

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
        message: 'Succefully created an asset',
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

      try {
        await controller.create(request.body, request.jwt);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
