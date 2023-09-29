import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockType } from '@/app.types';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import { CryptographyUtils } from '@utils/cryptography.utils';

import {
  mockUser,
  mockCreateUser,
  MockUsersRepository,
} from './fixtures/users.fixtures';

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, MockUsersRepository, CryptographyUtils],
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

  describe('getTopics', () => {
    it('should return a single user with topics', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      });

      const user = await service.getTopics(mockUser.id);

      expect(user.topics).toHaveLength(mockUser.topics.length);
    });

    it('should return an empty list for topics', async () => {
      Object.assign(mockUser, { topics: [] });

      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      });

      const user = await service.getTopics(mockUser.id);

      expect(user.topics).toEqual([]);
    });

    it('should throw a NotFoundExpception if user was not found', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getTopics('12334')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getComments', () => {
    it('should return a single user with comments', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      });

      const user = await service.getComments(mockUser.id);

      expect(user.comments).toHaveLength(mockUser.comments.length);
    });

    it('should throw a NotFoundExpception if user was not found', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getComments('12334')).rejects.toThrow(
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
