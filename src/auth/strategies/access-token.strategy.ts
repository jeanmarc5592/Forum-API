import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { HttpUtils } from '@/utils/http.utils';

import { JwtPayload, RequestUser } from '../auth.types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly httpUtils: HttpUtils,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return httpUtils.extractCookieFromRequest(req, 'accessToken');
      },
      secretOrKey: configService.get<string>('jwt.access.secret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  }
}
