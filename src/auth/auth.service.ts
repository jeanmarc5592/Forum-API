import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  login(user: User) {
    // TODO: Sign and return new JWT as "access_token"
    return {
      access_token: user,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const match = await compare(password, user.password);

    if (!match) {
      return null;
    }

    return user;
  }
}
