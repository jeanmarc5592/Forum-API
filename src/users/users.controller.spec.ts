import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TestUtils } from '../utils/test.utils';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    mockUsersService = TestUtils.mockUsersService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of users', async () => {
    const users = await controller.getUsers({ limit: 3, page: 1 });
    expect(users).toHaveLength(3);
  });

  it('should return the user with the provided id', async () => {
    const userId = '54';

    const user = await controller.getUserById(userId);

    expect(user.id).toBe(userId);
  });

  it('should return the updated user', async () => {
    const userId = '3';
    const userName = 'Updated Name';

    const user = await controller.updateUser(userId, { name: userName });

    expect(user.id).toBe(userId);
    expect(user.name).toBe(userName);
  });

  it('should return the deleted user', async () => {
    const userId = '5';

    const user = await controller.deleteUser(userId);

    expect(user.id).toBe(userId);
  });
});
