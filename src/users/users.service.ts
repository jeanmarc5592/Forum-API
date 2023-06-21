import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getUserById(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  async updateUser() {
    return 'UPDATE USER';
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found.`);
    }

    return await this.usersRepository.remove(user);
  }

  createUser() {
    return 'CREATED USER';
  }
}
