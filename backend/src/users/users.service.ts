import { DatabaseService } from '@/database/database.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const users_array = await this.databaseService.users.findMany({
      omit: { password: true },
    });
    if (!users_array.length) throw new NotFoundException('No users found');
    return users_array;
  }
}
