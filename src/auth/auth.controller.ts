import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { AccessTokenGuard } from './guards/access-token.guard';
import { User } from '../users/entities/users.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Req() req: { user: User }) {
    return this.authService.signin(req.user);
  }

  @Post('signup')
  signup(@Body() body: CreateUserDTO) {
    return this.authService.signup(body);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(@Req() req: any) {
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
