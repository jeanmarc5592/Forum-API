import { UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LocalStrategy } from './local.strategy';
import { User } from 'src/users/entities/user.entity';
import { Roles } from '../auth.types';

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
  role: Roles.USER,
  generateId: jest.fn(),
};

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
