import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { RequestUser, Roles } from '../auth/auth.types';
import { AbilityService } from '../ability/ability.service';

const mockUsers = [
  { id: '1', name: 'User 1' },
  { id: '2', name: 'User 2' },
  { id: '3', name: 'User 3' },
] as User[];

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
  role: Roles.USER,
  generateId: jest.fn(),
};

const mockRequest = {
  user: {
    id: '123',
    name: 'Request User',
    email: 'requser@email.com',
    role: Roles.USER,
  } as RequestUser,
};

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: AbilityService,
          useValue: {
            canUpdate: jest.fn(),
            canDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      jest.spyOn(usersService, 'getAll').mockResolvedValue(mockUsers);

      const users = await controller.getAll({ limit: 3, page: 1 });

      expect(users).toEqual(mockUsers);
    });
  });

  describe('getUsersById', () => {
    it('should return the user with the provided id', async () => {
      jest.spyOn(usersService, 'getById').mockResolvedValue(mockUser);

      const user = await controller.getById(mockUser.id);

      expect(user.id).toBe(mockUser.id);
    });
  });

  describe('updateUser', () => {
    it('should return the updated user', async () => {
      const userId = mockUser.id;
      const userName = 'Updated Name';

      Object.assign(mockUser, { name: userName });
      jest.spyOn(usersService, 'update').mockResolvedValue(mockUser);

      const user = await controller.update(
        userId,
        { name: userName },
        mockRequest,
      );

      expect(user.id).toBe(userId);
      expect(user.name).toBe(userName);
    });
  });

  describe('deleteUser', () => {
    it('should return the deleted user', async () => {
      const userId = mockUser.id;

      jest.spyOn(usersService, 'delete').mockResolvedValue(mockUser);

      const user = await controller.delete(userId, mockRequest);

      expect(user).toBe(mockUser);
    });
  });
});
