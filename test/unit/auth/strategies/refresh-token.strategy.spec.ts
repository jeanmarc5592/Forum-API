import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { RefreshTokenStrategy } from '@auth/strategies/refresh-token.strategy';
import { Request } from 'express';
import { JwtPayload } from '@auth/auth.types';

class MockConfigService extends ConfigService {
  get(key: string) {
    if (key === 'jwt.refresh.secret') {
      return 'secret';
    }
    return undefined;
  }
}

describe('RefreshTokenStrategy', () => {
  let strategy: RefreshTokenStrategy;

  beforeEach(() => {
    const mockConfigService = new MockConfigService();
    strategy = new RefreshTokenStrategy(mockConfigService);
  });

  it('should create an instance of AccessTokenStrategy', () => {
    expect(strategy).toBeInstanceOf(RefreshTokenStrategy);
    expect(strategy).toBeInstanceOf(Strategy);
  });

  it('should validate the request and payload', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const req = { get: jest.fn(() => 'Bearer token') } as Request;
    const payload = { sub: 'user123' } as JwtPayload;

    const validatedData = strategy.validate(req, payload);

    expect(req.get).toHaveBeenCalledWith('Authorization');
    expect(validatedData).toEqual({
      id: 'user123',
      refreshToken: 'token',
    });
  });
});
