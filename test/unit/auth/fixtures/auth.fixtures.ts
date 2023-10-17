import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { AuthService } from '@auth/auth.service';
import { Roles, RequestUser, TokensMap } from '@auth/auth.types';

export const MockAuthService: Provider = {
  provide: AuthService,
  useValue: {
    signin: jest.fn(),
    signup: jest.fn(),
    refresh: jest.fn(),
    signout: jest.fn(),
  },
};

export const mockTokens: TokensMap = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
};

export const MockJwtService: Provider = {
  provide: JwtService,
  useValue: {
    sign: jest.fn(),
  },
};

export const mockRequestWithUser = {
  user: {
    id: '123',
    name: 'Request User',
    email: 'requser@email.com',
    role: Roles.USER,
  } as RequestUser,
};

export const mockResponse = {
  cookie: jest.fn(),
} as unknown as Response;
