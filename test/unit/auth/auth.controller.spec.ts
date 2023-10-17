import { Test, TestingModule } from '@nestjs/testing';

import { Tokens } from '@/auth/auth.types';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';

import {
  MockAuthService,
  mockResponse,
  mockTokens,
} from './fixtures/auth.fixtures';
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

      await controller.signin({ user: mockUser }, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        Tokens.ACCESS_TOKEN,
        mockTokens.accessToken,
        { secure: true, httpOnly: true },
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        Tokens.REFRESH_TOKEN,
        mockTokens.refreshToken,
        { secure: true, httpOnly: true },
      );
    });
  });

  describe('signup', () => {
    it('should return the correct token pair', async () => {
      jest.spyOn(authService, 'signup').mockResolvedValue(mockTokens);

      await controller.signup(mockCreateUser, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        Tokens.ACCESS_TOKEN,
        mockTokens.accessToken,
        { secure: true, httpOnly: true },
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        Tokens.REFRESH_TOKEN,
        mockTokens.refreshToken,
        { secure: true, httpOnly: true },
      );
    });
  });

  describe('refresh', () => {
    it('should return the correct token pair', async () => {
      jest.spyOn(authService, 'refresh').mockResolvedValue(mockTokens);

      const user = { id: '1', refreshToken: 'refresh-token' };
      await controller.refresh({ user }, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        Tokens.ACCESS_TOKEN,
        mockTokens.accessToken,
        { secure: true, httpOnly: true },
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        Tokens.REFRESH_TOKEN,
        mockTokens.refreshToken,
        { secure: true, httpOnly: true },
      );
    });
  });

  it('should empty tokens after successfull signout', async () => {
    jest.spyOn(authService, 'signout').mockResolvedValue('OK');

    const user = { id: '1', name: 'User', email: 'user@example.com' };
    await controller.signout({ user }, mockResponse);

    expect(mockResponse.cookie).toHaveBeenCalledWith(Tokens.ACCESS_TOKEN, '', {
      expires: new Date(0),
      secure: true,
      httpOnly: true,
    });
    expect(mockResponse.cookie).toHaveBeenCalledWith(Tokens.REFRESH_TOKEN, '', {
      expires: new Date(0),
      secure: true,
      httpOnly: true,
    });
  });
});
