import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '@auth/auth.service';

export const MockAuthService: Provider = {
  provide: AuthService,
  useValue: {
    signin: jest.fn(),
    signup: jest.fn(),
    refresh: jest.fn(),
    signout: jest.fn(),
  },
};

export const mockTokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
};

export const MockJwtService: Provider = {
  provide: JwtService,
  useValue: {
    sign: jest.fn(),
  },
};
