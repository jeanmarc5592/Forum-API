import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { TestUtils } from '../utils/test.utils';

describe('AuthController', () => {
  let controller: AuthController;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    mockUsersService = TestUtils.mockUsersService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
