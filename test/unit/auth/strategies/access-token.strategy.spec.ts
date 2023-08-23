import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { AccessTokenStrategy } from '@auth/strategies/access-token.strategy';

class MockConfigService extends ConfigService {
  get(key: string) {
    if (key === 'jwt.access.secret') {
      return 'secret';
    }
    return undefined;
  }
}

describe('AccessTokenStrategy', () => {
  let strategy: AccessTokenStrategy;

  beforeEach(() => {
    const mockConfigService = new MockConfigService();
    strategy = new AccessTokenStrategy(mockConfigService);
  });

  it('should create an instance of AccessTokenStrategy', () => {
    expect(strategy).toBeInstanceOf(AccessTokenStrategy);
    expect(strategy).toBeInstanceOf(Strategy);
  });

  it('should validate the JWT payload', async () => {
    const payload = {
      sub: 'user123',
      name: 'John Doe',
      email: 'johndoe@example.com',
    };

    const validatedData = await strategy.validate(payload);

    expect(validatedData).toEqual({
      id: 'user123',
      name: 'John Doe',
      email: 'johndoe@example.com',
    });
  });
});
