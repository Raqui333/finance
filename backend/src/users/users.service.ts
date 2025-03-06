import { DatabaseService } from '@/database/database.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDTO: Prisma.usersCreateInput) {
    try {
      // normalize username
      const username = createUserDTO.username.toLowerCase();

      const userExists = await this.databaseService.users.findUnique({
        where: { username },
      });

      if (userExists) throw new BadRequestException('Username already taken');

      const { id } = await this.databaseService.users.create({
        data: {
          ...createUserDTO,
          username,
        },
      });

      return { message: 'Succefully create a new user', user_id: id };
    } catch (err) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async read(id: number) {
    const user = await this.databaseService.users.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.databaseService.users.findUnique({
      where: { username },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: number, updateUserDTO: Prisma.usersUpdateInput) {
    if ('id' in updateUserDTO) {
      // this is to prevent updating the id
      throw new BadRequestException('ID cannot be updated');
    }

    await this.read(id);

    const updated_user = await this.databaseService.users.update({
      where: { id },
      data: updateUserDTO,
    });

    if (!updated_user) throw new NotFoundException('User not found');

    return { message: 'Succefully update an user', user_id: updated_user.id };
  }

  async delete(id: number) {
    await this.read(id);

    await this.databaseService.users.delete({ where: { id } });

    return { message: 'Successfully deleted user', user_id: id };
  }

  async validateUsername(username: string) {
    const user = await this.databaseService.users.findUnique({
      where: { username },
    });

    if (user) throw new UnauthorizedException('Username already taken');

    return { available: true };
  }
}
