import { Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // TODO: Type "req" correctly
  login(@Req() req: { user: any }) {
    return this.authService.login(req.user);
  }

  // TODO: Implement logout
}
