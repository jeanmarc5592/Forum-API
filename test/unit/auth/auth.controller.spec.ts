import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';

import { MockAuthService, mockTokens } from './fixtures/auth.fixtures';
import { mockUser, mockCreateUser } from '../users/fixtures/users.fixtures';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [MockAuthService],
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
