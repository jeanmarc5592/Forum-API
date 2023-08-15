import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, RequestUser } from './auth.types';
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

  async signin(user: RequestUser) {
    const tokens = this.generateTokens(user);
    const { refreshToken } = tokens;

    await this.updateRefreshToken(user.id, refreshToken);

    return tokens;
  }

  async signup(userDTO: CreateUserDTO) {
    const user = await this.usersService.create(userDTO);

    const tokens = this.generateTokens(user);
    const { refreshToken } = tokens;

    await this.updateRefreshToken(user.id, refreshToken);

    return tokens;
  }

  async refresh(userId: string, token: string) {
    const user = await this.usersService.getById(userId);

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
    await this.usersService.update({ refreshToken: null }, user.id);
    return 'OK';
  }

  async validateUser(credentials: LoginDTO) {
    const { email, password } = credentials;

    const user = await this.usersService.getByEmail(email);
    const match = await this.cryptographyUtils.verify(user.password, password);

    if (!match) {
      return null;
    }

    return user;
  }

  private async updateRefreshToken(userId: string, rawRefreshToken: string) {
    const refreshToken = await this.cryptographyUtils.hash(rawRefreshToken);
    return await this.usersService.update({ refreshToken }, userId);
  }

  private generateTokens(user: RequestUser) {
    const accessTokenPayload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const refreshTokenPayload: JwtPayload = {
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get<string>('jwt.access.secret'),
      expiresIn: this.configService.get<string>('jwt.access.expiration'),
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>('jwt.refresh.secret'),
      expiresIn: this.configService.get<string>('jwt.refresh.expiration'),
    });

    return { accessToken, refreshToken };
  }
}
