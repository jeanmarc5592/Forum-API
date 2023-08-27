import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '@auth/auth.service';
import { UsersService } from '@users/users.service';
import { CryptographyUtils } from '@utils/cryptography.utils';

import { MockJwtService } from './fixtures/auth.fixtures';
import {
  mockUser,
  mockCreateUser,
  MockUsersService,
} from '../users/fixtures/users.fixtures';
import { MockCryptographyUtils } from '../utils/fixtures/cryptography.utils.fixtures';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  let cryptographyUtils: CryptographyUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        MockUsersService,
        MockJwtService,
        MockCryptographyUtils,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    cryptographyUtils = module.get<CryptographyUtils>(CryptographyUtils);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signin', () => {
    it('should return the correct token pair', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked-token');

      const tokens = await service.signin(mockUser);

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens.accessToken).toBe('mocked-token');

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens.refreshToken).toBe('mocked-token');
    });
  });

  describe('signup', () => {
    it('should return the correct token pair', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked-token');
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'getById').mockResolvedValue(mockUser);

      const tokens = await service.signup(mockCreateUser);

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens.accessToken).toBe('mocked-token');

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens.refreshToken).toBe('mocked-token');
    });
  });

  describe('refresh', () => {
    it('should return the correct token pair', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked-token');
      jest.spyOn(cryptographyUtils, 'verify').mockResolvedValue(true);
      jest.spyOn(usersService, 'getById').mockResolvedValue(mockUser);

      const tokens = await service.refresh('1', 'token');

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens.accessToken).toBe('mocked-token');

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens.refreshToken).toBe('mocked-token');
    });

    it('should throw UnauthorizedException if user.refreshToken is null', async () => {
      Object.assign(mockUser, { refreshToken: null });

      jest.spyOn(usersService, 'getById').mockResolvedValue(mockUser);

      await expect(service.refresh('123', 'Token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if tokens do not match', async () => {
      jest.spyOn(cryptographyUtils, 'verify').mockResolvedValue(false);
      jest.spyOn(usersService, 'getById').mockResolvedValue(mockUser);

      await expect(service.refresh('123', 'InvalidToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('signout', () => {
    it('should update the user and return "OK"', async () => {
      await service.signout(mockUser);

      expect(usersService.update).toHaveBeenCalledWith(
        { refreshToken: null },
        mockUser.id,
      );
    });

    it('should return "OK"', async () => {
      const result = await service.signout(mockUser);

      expect(result).toEqual('OK');
    });
  });

  describe('validateUser', () => {
    it('should return null if password does not match', async () => {
      const credentials = { email: 'email@example.com', password: 'wrong' };

      jest.spyOn(usersService, 'getByEmail').mockResolvedValue(mockUser);
      jest.spyOn(cryptographyUtils, 'verify').mockResolvedValue(false);

      const result = await service.validateUser(credentials);

      expect(result).toBeNull();
    });

    it('should return the user if credentials are valid', async () => {
      const credentials = { email: 'email@example.com', password: 'password' };

      jest.spyOn(usersService, 'getByEmail').mockResolvedValue(mockUser);
      jest.spyOn(cryptographyUtils, 'verify').mockResolvedValue(true);

      const result = await service.validateUser(credentials);

      expect(result).toEqual(mockUser);
    });
  });
});
