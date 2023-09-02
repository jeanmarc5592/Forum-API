import { UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';

import { AuthService } from '@auth/auth.service';
import { LocalStrategy } from '@auth/strategies/local.strategy';

import { mockUser } from '../../users/fixtures/users.fixtures';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(() => {
    authService = mockAuthService as any;
    strategy = new LocalStrategy(authService);
  });

  it('should create an instance of LocalStrategy', () => {
    expect(strategy).toBeInstanceOf(LocalStrategy);
    expect(strategy).toBeInstanceOf(Strategy);
  });

  describe('validate', () => {
    const email = mockUser.email;
    const password = mockUser.password;

    it('should validate the credentials and return the user', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await strategy.validate(email, password);

      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith({
        email,
        password,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(strategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith({
        email,
        password,
      });
    });
  });
});
