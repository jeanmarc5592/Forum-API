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
import { CryptographyUtils } from '../utils/cryptography.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly cryptographyUtils: CryptographyUtils,
  ) {}

  async getUsers(limit: number, page: number) {
    const skip = (page - 1) * limit;
    const take = limit;

    return await this.usersRepository.find({ skip, take });
  }

  async getUserById(id: string) {
    return await this.findUserById(id);
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async updateUser(userDTO: UpdateUserDTO, id: string) {
    const user = await this.findUserById(id);

    Object.assign(user, userDTO);

    return await this.usersRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.findUserById(id);

    return await this.usersRepository.remove(user);
  }

  async createUser(userDTO: CreateUserDTO) {
    const { email, password, name } = userDTO;

    const user = await this.usersRepository.findOne({
      where: [{ email }, { name }],
    });

    if (user) {
      throw new BadRequestException(
        `A user with the email '${email}' or the name '${name}' already exists.`,
      );
    }

    const newUser = this.usersRepository.create(userDTO);
    newUser.password = await this.cryptographyUtils.hash(password);

    return await this.usersRepository.save(newUser);
  }

  private async findUserById(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found.`);
    }

    return user;
  }
}
