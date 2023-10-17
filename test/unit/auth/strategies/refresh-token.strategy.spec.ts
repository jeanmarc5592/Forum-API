import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { HttpUtils } from '@/utils/http.utils';
import { RefreshTokenStrategy } from '@auth/strategies/refresh-token.strategy';

import { mockTokens } from '../fixtures/auth.fixtures';

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
  let httpUtils: HttpUtils;

  beforeEach(() => {
    httpUtils = {
      checkIfParamIsUuid: jest.fn(),
      extractCookieFromRequest: jest.fn(),
    };
    const mockConfigService = new MockConfigService();

    strategy = new RefreshTokenStrategy(mockConfigService, httpUtils);
  });

  it('should create an instance of AccessTokenStrategy', () => {
    expect(strategy).toBeInstanceOf(RefreshTokenStrategy);
    expect(strategy).toBeInstanceOf(Strategy);
  });

  it('should validate the request and payload', () => {
    const req = {} as Request;
    const payload = { sub: '12345' };

    const refreshToken = mockTokens.refreshToken;

    jest
      .spyOn(httpUtils, 'extractCookieFromRequest')
      .mockReturnValue(refreshToken);

    const result = strategy.validate(req, payload);

    expect(result).toEqual({ id: '12345', refreshToken });
  });
});
