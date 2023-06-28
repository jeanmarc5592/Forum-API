import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  // TODO: Type "req" correctly
  signin(@Req() req: { user: any }) {
    return this.authService.signin(req.user);
  }

  @Post('signup')
  signup(@Body() body: CreateUserDTO) {
    return this.authService.signup(body);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  // TODO: Type "req" correctly
  refresh(@Req() req: { user: any; refreshToken: any }) {
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];

    return this.authService.refresh(userId, refreshToken);
  }

  // TODO: Implement logout
}
