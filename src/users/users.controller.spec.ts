import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { CreateUserDTO } from './dtos/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    mockUsersService = {
      getUsers: () => {
        return Promise.resolve([
          { id: '1', name: 'User 1' },
          { id: '2', name: 'User 2' },
          { id: '3', name: 'User 3' },
        ] as User[]);
      },
      getUserById: (id: string) => {
        return Promise.resolve({
          id,
          name: `User ${id}`,
        } as User);
      },
      updateUser: (userDTO: UpdateUserDTO, id: string) => {
        return Promise.resolve({
          id,
          ...userDTO,
        } as User);
      },
      deleteUser: (id: string) => {
        return Promise.resolve({
          id,
          name: `User ${id}`,
        } as User);
      },
      createUser: (userDTO: CreateUserDTO) => {
        return Promise.resolve({
          id: '1',
          ...userDTO,
        } as User);
      },
    };

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

  it('should return the created user', async () => {
    const email = 'test@example.com';
    const name = 'Test User';
    const age = '66';
    const password = 'My Password';

    const newUser: CreateUserDTO = {
      email,
      name,
      age,
      password,
    };

    const user = await controller.createUser(newUser);

    expect(user.email).toBe(email);
    expect(user.name).toBe(name);
    expect(user.age).toBe(age);
    expect(user.password).toBe(password);
    expect(user.bio).toBeFalsy();
  });
});
