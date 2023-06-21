import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getUserById(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found.`);
    }

    return user;
  }

  async updateUser(userDTO: UpdateUserDTO, id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found.`);
    }

    Object.assign(user, userDTO);

    return await this.usersRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found.`);
    }

    return await this.usersRepository.remove(user);
  }

  async createUser(userDTO: CreateUserDTO) {
    const { email } = userDTO;

    const user = await this.usersRepository.findOneBy({ email });

    if (user) {
      throw new BadRequestException(
        `A user with the email '${email}' already exists.`,
      );
    }

    const newUser = this.usersRepository.create(userDTO);

    return await this.usersRepository.save(newUser);
  }
}
