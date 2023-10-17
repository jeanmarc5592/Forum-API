import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { HttpUtils } from '@/utils/http.utils';

import { JwtPayload, Tokens } from '../auth.types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly httpUtils: HttpUtils,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return httpUtils.extractCookieFromRequest(req, Tokens.REFRESH_TOKEN);
      },
      secretOrKey: configService.get<string>('jwt.refresh.secret'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = this.httpUtils.extractCookieFromRequest(
      req,
      Tokens.REFRESH_TOKEN,
    );

    return { id: payload.sub, refreshToken };
  }
}
