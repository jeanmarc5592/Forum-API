import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'My Password',
  age: '18',
  bio: 'User bio',
  created_at: new Date(),
  updated_at: new Date(),
  generateId: jest.fn(),
};

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    find: jest.fn((entity) => entity),
    findOneBy: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    remove: jest.fn((entity) => entity),
  }),
);

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
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of users', async () => {
    repositoryMock.find?.mockReturnValue([mockUser]);

    const users = await service.getUsers(1, 1);

    expect(users).toEqual([mockUser]);
  });

  it('should return an empty list', async () => {
    repositoryMock.find?.mockReturnValue([]);

    const users = await service.getUsers(1, 1);

    expect(users).toEqual([]);
  });

  it('should return a single user', async () => {
    repositoryMock.findOneBy?.mockReturnValue(mockUser);

    const user = await service.getUserById('1');

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

    await expect(service.getUserById('3234123423')).rejects.toThrow(
      NotFoundException,
    );

    await expect(service.updateUser({}, '3234123423')).rejects.toThrow(
      NotFoundException,
    );

    await expect(service.deleteUser('3234123423')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update an existing user', async () => {
    const updates = { name: 'Updated Name' };

    repositoryMock.findOneBy?.mockReturnValue(mockUser);
    repositoryMock.save?.mockReturnValue({ ...mockUser, ...updates });

    const user = await service.updateUser(updates, '1');

    expect(user.id).toBe(mockUser.id);
    expect(user.name).toBe(updates.name);
  });

  it('should delete an existing user', async () => {
    repositoryMock.findOneBy?.mockReturnValue(mockUser);
    repositoryMock.delete?.mockReturnValue(mockUser);

    const user = await service.deleteUser('1');

    expect(user.id).toBe(mockUser.id);
    expect(user.email).toBe(mockUser.email);
    expect(user.name).toBe(mockUser.name);
    expect(user.password).toBe(mockUser.password);
    expect(user.age).toBe(mockUser.age);
    expect(user.bio).toBe(mockUser.bio);
  });

  it('should create a new user', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    repositoryMock.findOne?.mockReturnValue(null);
    repositoryMock.create?.mockReturnValue(mockUser);
    repositoryMock.save?.mockReturnValue({ ...mockUser, password: 'Hash123!' });

    const user = await service.createUser(mockUser);

    expect(user.id).toBe(mockUser.id);
    expect(user.email).toBe(mockUser.email);
    expect(user.name).toBe(mockUser.name);
    expect(user.password).not.toBe(mockUser.password);
    expect(user.password).toBe('Hash123!');
    expect(user.age).toBe(mockUser.age);
    expect(user.bio).toBe(mockUser.bio);
  });

  it('should throw a BadRequestException if a user already exists', async () => {
    repositoryMock.findOne?.mockReturnValue(mockUser);

    await expect(service.createUser(mockUser)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should hash a password', async () => {
    const hashPassword = Reflect.get(service, 'hashPassword');

    const password = 'MySuperCoolPassword123!';

    const newPassword = await hashPassword(password);

    expect(newPassword).not.toBe(password);
  });
});
