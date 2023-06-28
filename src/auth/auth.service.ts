import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.types';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { UpdateUserDTO } from 'src/users/dtos/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signin(user: User) {
    const tokens = this.generateTokens(user);

    // TODO: Update User and store refresh Token

    return tokens;
  }

  async signup(userDTO: CreateUserDTO) {
    // Create a new user based on the userDTO
    const user = await this.usersService.createUser(userDTO);

    // Create accessToken and refreshToken based on that new user
    const tokens = this.generateTokens(user);
    const { refreshToken } = tokens;

    // Update the new user and store the refreshToken
    const updates: UpdateUserDTO = { ...user, refreshToken };
    await this.usersService.updateUser(updates, user.id);

    // Return accessToken and refreshToken
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
