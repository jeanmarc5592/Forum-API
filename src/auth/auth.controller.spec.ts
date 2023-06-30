import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { TestUtils } from '../utils/test.utils';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { User } from '../users/entities/users.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = TestUtils.mockAuthService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return token pair', async () => {
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

    // SIGNIN
    const signinTokens = await controller.signin({ user: mockUser });

    expect(signinTokens).toHaveProperty('accessToken');
    expect(typeof signinTokens.accessToken).toBe('string');

    expect(signinTokens).toHaveProperty('refreshToken');
    expect(typeof signinTokens.refreshToken).toBe('string');

    // SIGNUP
    const mockCreateUser: CreateUserDTO = {
      name: 'User 1',
      email: 'test@example.com',
      password: 'password',
      age: '30',
    };
    const signupTokens = await controller.signup(mockCreateUser);

    expect(signupTokens).toHaveProperty('accessToken');
    expect(typeof signupTokens.accessToken).toBe('string');

    expect(signupTokens).toHaveProperty('refreshToken');
    expect(typeof signupTokens.refreshToken).toBe('string');

    // REFRESH
    const refreshTokens = await controller.refresh({ user: { id: '1' } });

    expect(refreshTokens).toHaveProperty('accessToken');
    expect(typeof refreshTokens.accessToken).toBe('string');

    expect(refreshTokens).toHaveProperty('refreshToken');
    expect(typeof refreshTokens.refreshToken).toBe('string');
  });

  it('should return OK after successful signout', async () => {
    const result = await controller.signout({});

    expect(result).toBe('OK');
  });
});
