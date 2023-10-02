import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Comment } from '@/comments/entities/comment.entity';
import { Topic } from '@/topics/entities/topic.entity';
import { Roles } from '@auth/auth.types';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { CreateUserDTO } from '@users/dtos/create-user.dto';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';

import { repositoryMockFactory } from '../../../test.types';

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
  topics: [
    { id: '1', title: 'Topic 1' } as Topic,
    { id: '2', title: 'Topic 2' } as Topic,
  ],
  subCategories: [
    { id: '1', name: 'Sub Category 1' } as SubCategory,
    { id: '2', name: 'Sub Category 2' } as SubCategory,
  ],
  comments: [
    { id: '1', content: 'Comment 1' } as Comment,
    { id: '2', content: 'Comment 2' } as Comment,
  ],
  role: Roles.USER,
  generateId: jest.fn(),
};

export const MockUsersRepository = {
  provide: getRepositoryToken(User),
  useFactory: repositoryMockFactory,
};

export const mockUsers = [
  { id: '1', name: 'User 1' },
  { id: '2', name: 'User 2' },
  { id: '3', name: 'User 3' },
] as User[];

export const mockCreateUser: CreateUserDTO = {
  name: 'User 1',
  email: 'test@example.com',
  password: 'password',
  age: '30',
};

export const MockUsersService: Provider = {
  provide: UsersService,
  useValue: {
    getAll: jest.fn(),
    getByEmail: jest.fn(),
    getById: jest.fn(),
    getTopics: jest.fn(),
    getComments: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};
