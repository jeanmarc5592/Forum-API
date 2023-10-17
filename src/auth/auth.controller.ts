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
  async signup(
    @Body() body: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signup(body);

    res.cookie(Tokens.ACCESS_TOKEN, tokens.accessToken, {
      secure: true,
      httpOnly: true,
    });
    res.cookie(Tokens.REFRESH_TOKEN, tokens.refreshToken, {
      secure: true,
      httpOnly: true,
    });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @Req() req: { user: { id: string; refreshToken: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    const tokens = await this.authService.refresh(userId, refreshToken);

    res.cookie(Tokens.ACCESS_TOKEN, tokens.accessToken, {
      secure: true,
      httpOnly: true,
    });
    res.cookie(Tokens.REFRESH_TOKEN, tokens.refreshToken, {
      secure: true,
      httpOnly: true,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post('signout')
  async signout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.signout(req.user);

    res.clearCookie(Tokens.ACCESS_TOKEN);
    res.clearCookie(Tokens.REFRESH_TOKEN);
  }
}
