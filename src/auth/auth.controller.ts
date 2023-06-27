import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // TODO: Type "req" correctly
  login(@Req() req: { user: any }) {
    return this.authService.login(req.user);
  }

  // TODO: Implement logout
}
