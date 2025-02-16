import { DatabaseService } from '@/database/database.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomBytes, pbkdf2Sync } from 'crypto'; // for hashing the password

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${hash}.${salt}`;
  }

  verifyPassword(password: string, hashedPassword: string) {
    const [originalHash, salt] = hashedPassword.split('.');
    const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  }

  async create(createUserDTO: Prisma.usersCreateInput) {
    try {
      const { id } = await this.databaseService.users.create({
        data: {
          ...createUserDTO,

          // normalize usernane
          username: createUserDTO.username.toLocaleLowerCase(),

          // hash password
          password: this.hashPassword(createUserDTO.password),

          balance: 0,
        },
      });

      return { message: 'Succefully create a new user', user_id: id };
    } catch (err) {
      throw err;
    }
  }

  async findAll() {
    const users_array = await this.databaseService.users.findMany({
      omit: { password: true },
    });

    if (!users_array.length) throw new NotFoundException('No users found');

    return users_array;
  }

  async findOne(id: number) {
    const user = await this.databaseService.users.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: number, updateUserDTO: Prisma.usersUpdateInput) {
    // todo
  }

  async delete(id: number) {
    // todo
  }
}
