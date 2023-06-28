import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
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
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async signup(userDTO: CreateUserDTO) {
    // Create a new user based on the userDTO
    const user = await this.usersService.createUser(userDTO);

    // Create accessToken and refreshToken based on that new user
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Update the new user and store the refreshToken
    const updates: UpdateUserDTO = { ...user, refreshToken };
    await this.usersService.updateUser(updates, user.id);

    // Return accessToken and refreshToken
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

  private async hashData(data: string) {
    const hashedPassword = await hash(data, 10);
    return hashedPassword;
  }
}
