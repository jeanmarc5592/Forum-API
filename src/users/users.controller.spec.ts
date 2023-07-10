import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

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
  generateId: jest.fn(),
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
            getUsers: jest.fn(),
            getUserById: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
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
      jest.spyOn(usersService, 'getUsers').mockResolvedValue(mockUsers);

      const users = await controller.getUsers({ limit: 3, page: 1 });

      expect(users).toEqual(mockUsers);
    });
  });

  describe('getUsersById', () => {
    it('should return the user with the provided id', async () => {
      jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser);

      const user = await controller.getUserById(mockUser.id);

      expect(user.id).toBe(mockUser.id);
    });
  });

  describe('updateUser', () => {
    it('should return the updated user', async () => {
      const userId = mockUser.id;
      const userName = 'Updated Name';

      Object.assign(mockUser, { name: userName });
      jest.spyOn(usersService, 'updateUser').mockResolvedValue(mockUser);

      const user = await controller.updateUser(userId, { name: userName });

      expect(user.id).toBe(userId);
      expect(user.name).toBe(userName);
    });
  });

  describe('deleteUser', () => {
    it('should return the deleted user', async () => {
      const userId = mockUser.id;

      jest.spyOn(usersService, 'deleteUser').mockResolvedValue(mockUser);

      const user = await controller.deleteUser(userId);

      expect(user).toBe(mockUser);
    });
  });
});
