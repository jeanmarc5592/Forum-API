import { Test, TestingModule } from '@nestjs/testing';

import { RequestUser, Roles } from '@auth/auth.types';
import { UsersController } from '@users/users.controller';
import { UsersService } from '@users/users.service';

import {
  mockUsers,
  mockUser,
  MockUsersService,
} from './fixtures/users.fixtures';
import { MockUsersUtils } from './fixtures/users.utils.fixtures';
import { MockAbilityService } from '../ability/fixtures/ability.fixtures';

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
      providers: [MockUsersService, MockAbilityService, MockUsersUtils],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of users', async () => {
      jest.spyOn(usersService, 'getAll').mockResolvedValue(mockUsers);

      const users = await controller.getAll({ limit: 3, page: 1 });

      expect(users).toEqual(mockUsers);
    });
  });

  describe('getById', () => {
    it('should return the user with the provided id', async () => {
      jest.spyOn(usersService, 'getById').mockResolvedValue(mockUser);

      const user = await controller.getById(mockUser.id);

      expect(user.id).toBe(mockUser.id);
    });
  });

  describe('getTopics', () => {
    it('should return the topics of the user with the provided id', async () => {
      const topics = mockUser.topics;

      jest.spyOn(usersService, 'getTopics').mockResolvedValue(mockUser);

      const subCat = await controller.getTopics(mockUser.id);

      expect(subCat.topics).toEqual(topics);
    });
  });

  describe('update', () => {
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

  describe('delete', () => {
    it('should return the deleted user', async () => {
      const userId = mockUser.id;

      jest.spyOn(usersService, 'delete').mockResolvedValue(mockUser);

      const user = await controller.delete(userId, mockRequest);

      expect(user).toBe(mockUser);
    });
  });
});
