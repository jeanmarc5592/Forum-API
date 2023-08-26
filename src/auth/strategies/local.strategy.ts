import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { LoginDTO } from '../dtos/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const credentials = { email, password } as LoginDTO;
    const user = await this.authService.validateUser(credentials);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
