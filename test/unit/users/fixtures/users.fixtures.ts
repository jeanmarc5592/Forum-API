import { Provider } from '@nestjs/common';

import { Roles } from '@auth/auth.types';
import { CreateUserDTO } from '@users/dtos/create-user.dto';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';

export const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'My Password',
  age: '18',
  bio: 'User bio',
  created_at: new Date(),
  updated_at: new Date(),
  refreshToken: 'Token',
  topics: [],
  role: Roles.USER,
  generateId: jest.fn(),
};

export const mockCreateUser: CreateUserDTO = {
  name: 'User 1',
  email: 'test@example.com',
  password: 'password',
  age: '30',
};

export const MockUsersService: Provider = {
  provide: UsersService,
  useValue: {
    create: jest.fn(),
    update: jest.fn(),
    getByEmail: jest.fn(),
    getById: jest.fn(),
  },
};
