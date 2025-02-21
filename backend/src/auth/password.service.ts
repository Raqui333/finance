import { Injectable } from '@nestjs/common';
import { randomBytes, pbkdf2Sync } from 'crypto'; // for hashing the password

@Injectable()
export class PasswordService {
  private readonly saltLength = 16;
  private readonly iterations = 1000;
  private readonly keyLength = 64;
  private readonly digest = 'sha512';

  hashPassword(password: string): string {
    const salt = randomBytes(this.saltLength).toString('hex');
    const hash = pbkdf2Sync(
      password,
      salt,
      this.iterations,
      this.keyLength,
      this.digest
    ).toString('hex');
    return `${hash}:${salt}`;
  }

  verifyPassword(password: string, hashedPassword: string): boolean {
    const [originalHash, salt] = hashedPassword.split(':');
    const hash = pbkdf2Sync(
      password,
      salt,
      this.iterations,
      this.keyLength,
      this.digest
    ).toString('hex');
    return hash === originalHash;
  }
}
