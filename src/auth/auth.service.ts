import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.types';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signin(user: User) {
    const tokens = this.generateTokens(user);
    const { refreshToken } = tokens;

    await this.updateRefreshToken(user.id, refreshToken);

    return tokens;
  }

  async signup(userDTO: CreateUserDTO) {
    const user = await this.usersService.createUser(userDTO);

    const tokens = this.generateTokens(user);
    const { refreshToken } = tokens;

    await this.updateRefreshToken(user.id, refreshToken);

    return tokens;
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

  private async updateRefreshToken(userId: string, refreshToken: string) {
    return await this.usersService.updateUser({ refreshToken }, userId);
  }

  private generateTokens(user: User) {
    const accessTokenPayload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    const refreshTokenPayload: JwtPayload = {
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
    });

    return { accessToken, refreshToken };
  }
}
