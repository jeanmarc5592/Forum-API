import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {
  login(user: User) {
    // TODO: Sign and return new JWT as "access_token"
    return {
      access_token: 'TOKEN',
    };
  }
}
