import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { CreateUserDTO } from '@users/dtos/create-user.dto';

import { AuthService } from './auth.service';
import { RequestUser, Tokens } from './auth.types';
import { AccessTokenGuard } from './guards/access-token.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(
    @Req() req: { user: RequestUser },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signin(req.user);

    res.cookie(Tokens.ACCESS_TOKEN, tokens.accessToken, {
      secure: true,
      httpOnly: true,
    });
    res.cookie(Tokens.REFRESH_TOKEN, tokens.refreshToken, {
      secure: true,
      httpOnly: true,
    });
  }

  @Post('signup')
  signup(@Body() body: CreateUserDTO) {
    return this.authService.signup(body);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(@Req() req: { user: { id: string; refreshToken: string } }) {
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];

    return this.authService.refresh(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Post('signout')
  signout(@Req() req: any) {
    return this.authService.signout(req.user);
  }
}
