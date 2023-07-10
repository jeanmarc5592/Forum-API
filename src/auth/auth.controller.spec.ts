import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { User } from '../users/entities/user.entity';

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

const mockCreateUser: CreateUserDTO = {
  name: 'User 1',
  email: 'test@example.com',
  password: 'password',
  age: '30',
};

const mockTokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signin: jest.fn(),
            signup: jest.fn(),
            refresh: jest.fn(),
            signout: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signin', () => {
    it('should return the correct token pair', async () => {
      jest.spyOn(authService, 'signin').mockResolvedValue(mockTokens);

      const tokens = await controller.signin({ user: mockUser });

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens.accessToken).toBe(mockTokens.accessToken);

      expect(tokens).toHaveProperty('refreshToken');
      expect(tokens.refreshToken).toBe(mockTokens.refreshToken);
    });
  });

  describe('signup', () => {
    it('should return the correct token pair', async () => {
      jest.spyOn(authService, 'signup').mockResolvedValue(mockTokens);

      const tokens = await controller.signup(mockCreateUser);

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens.accessToken).toBe(mockTokens.accessToken);

      expect(tokens).toHaveProperty('refreshToken');
      expect(tokens.refreshToken).toBe(mockTokens.refreshToken);
    });
  });

  describe('refresh', () => {
    it('should return the correct token pair', async () => {
      jest.spyOn(authService, 'refresh').mockResolvedValue(mockTokens);

      const user = { id: '1', refreshToken: 'refresh-token' };
      const tokens = await controller.refresh({ user });

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens.accessToken).toBe(mockTokens.accessToken);

      expect(tokens).toHaveProperty('refreshToken');
      expect(tokens.refreshToken).toBe(mockTokens.refreshToken);
    });
  });

  it('should return OK after successful signout', async () => {
    jest.spyOn(authService, 'signout').mockResolvedValue('OK');

    const user = { id: '1', name: 'User', email: 'user@example.com' };
    const result = await controller.signout({ user });

    expect(result).toBe('OK');
  });
});
