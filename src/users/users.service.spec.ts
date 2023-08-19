import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CryptographyUtils } from '../utils/cryptography.utils';
import { CreateUserDTO } from './dtos/create-user.dto';
import { Roles } from '../auth/auth.types';
import { MockType, repositoryMockFactory } from '../app.types';

const mockUser: User = {
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

const mockCreateUser: CreateUserDTO = {
  name: 'User 1',
  email: 'test@example.com',
  password: 'password',
  age: '30',
};

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        CryptographyUtils,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of users', async () => {
      repositoryMock.find?.mockReturnValue([mockUser]);

      const users = await service.getAll(1, 1);

      expect(users).toEqual([mockUser]);
    });

    it('should return an empty list', async () => {
      repositoryMock.find?.mockReturnValue([]);

      const users = await service.getAll(1, 1);

      expect(users).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a single user', async () => {
      repositoryMock.findOneBy?.mockReturnValue(mockUser);

      const user = await service.getById(mockUser.id);

      expect(user.id).toBe(mockUser.id);
      expect(user.email).toBe(mockUser.email);
      expect(user.name).toBe(mockUser.name);
      expect(user.password).toBe(mockUser.password);
      expect(user.age).toBe(mockUser.age);
      expect(user.bio).toBe(mockUser.bio);
    });

    it('should throw a NotFoundException if a user was not found', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.getById('3234123423')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getByEmail', () => {
    it('should return a single user', async () => {
      repositoryMock.findOneBy?.mockReturnValue(mockUser);

      const user = await service.getByEmail(mockUser.email);

      expect(user.id).toBe(mockUser.id);
      expect(user.email).toBe(mockUser.email);
      expect(user.name).toBe(mockUser.name);
      expect(user.password).toBe(mockUser.password);
      expect(user.age).toBe(mockUser.age);
      expect(user.bio).toBe(mockUser.bio);
    });

    it('should throw a NotFoundException if a user was not found', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.getByEmail('3234123423')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updates = { name: 'Updated Name' };

      repositoryMock.findOneBy?.mockReturnValue(mockUser);
      repositoryMock.save?.mockReturnValue({ ...mockUser, ...updates });

      const user = await service.update(updates, '1');

      expect(user.id).toBe(mockUser.id);
      expect(user.name).toBe(updates.name);
    });

    it('should throw a NotFoundException if a user was not found', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.update({}, '3234123423')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing user', async () => {
      repositoryMock.findOneBy?.mockReturnValue(mockUser);
      repositoryMock.delete?.mockReturnValue(mockUser);

      const user = await service.delete('1');

      expect(user.id).toBe(mockUser.id);
      expect(user.email).toBe(mockUser.email);
      expect(user.name).toBe(mockUser.name);
      expect(user.password).toBe(mockUser.password);
      expect(user.age).toBe(mockUser.age);
      expect(user.bio).toBe(mockUser.bio);
    });

    it('should throw a NotFoundException if a user was not found', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.delete('3234123423')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOne?.mockReturnValue(null);
      repositoryMock.create?.mockReturnValue(mockCreateUser);
      repositoryMock.save?.mockReturnValue({
        ...mockCreateUser,
        password: 'Hash123!',
      });

      const user = await service.create(mockCreateUser);

      expect(user.email).toBe(mockCreateUser.email);
      expect(user.name).toBe(mockCreateUser.name);
      expect(user.password).not.toBe(mockCreateUser.password);
      expect(user.password).toBe('Hash123!');
      expect(user.age).toBe(mockCreateUser.age);
      expect(user.bio).toBe(mockCreateUser.bio);
    });

    it('should throw a BadRequestException if a user already exists', async () => {
      repositoryMock.findOne?.mockReturnValue(mockUser);

      await expect(service.create(mockCreateUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
