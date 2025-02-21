import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  const password = 'password';
  const hashedPassword =
    '39f711b565fe802e1fa7f974a7d0d064d79e3c0cf761d68e5a3bf0395ab6a0f6cb11b4b11be48b9954a509715a3b684fda716e679347749e99193d67eeb18a64:17993d55fe3d1d573bde8f641fdce9f7';

  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash a password', async () => {
    const hash = service.hashPassword(password);
    expect(hash).toBeDefined();
    expect(hash).not.toEqual(password);
    expect(hash).toHaveLength(161);
  });

  it('should verify a password', async () => {
    const result = service.verifyPassword('password', hashedPassword);
    expect(result).toBeDefined();
    expect(result).toBe(true);
  });
});
