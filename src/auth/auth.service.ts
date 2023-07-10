import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.types';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { CryptographyUtils } from '../utils/cryptography.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cryptographyUtils: CryptographyUtils,
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

  async refresh(userId: string, token: string) {
    const user = await this.usersService.getUserById(userId);

    // "refreshToken" is null when the user is logged out
    if (user.refreshToken === null) {
      throw new UnauthorizedException();
    }

    const match = await this.cryptographyUtils.verify(user.refreshToken, token);

    if (!match) {
      throw new UnauthorizedException();
    }

    const tokens = this.generateTokens(user);
    const { refreshToken } = tokens;

    await this.updateRefreshToken(user.id, refreshToken);

    return tokens;
  }

  async signout(user: User) {
    await this.usersService.updateUser({ refreshToken: null }, user.id);
    return 'OK';
  }

  async validateUser(credentials: LoginDTO) {
    const { email, password } = credentials;
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const match = await this.cryptographyUtils.verify(user.password, password);

    if (!match) {
      return null;
    }

    return user;
  }

  private async updateRefreshToken(userId: string, rawRefreshToken: string) {
    const refreshToken = await this.cryptographyUtils.hash(rawRefreshToken);
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
