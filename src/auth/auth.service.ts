import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signin(user: User) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async validateUser(credentials: LoginDTO) {
    const { email, password } = credentials;
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

  private generateAccessToken(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
    });
  }

  private generateRefreshToken(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
    });
  }
}
