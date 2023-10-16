import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { Repository } from 'typeorm';

import { CryptographyUtils } from '@/utils/cryptography.utils';

import { User } from './entities/user.entity';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly cryptographyUtils: CryptographyUtils,
  ) {}

  async seed() {
    const users = DataFactory.createForClass(User).generate(1);
    users[0].password = await this.cryptographyUtils.hash(users[0].password);

    this.usersRepository.create(users);

    return this.usersRepository.save(users);
  }

  async drop() {
    return;
  }
}
