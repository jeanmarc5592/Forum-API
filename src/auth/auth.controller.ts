import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  // TODO: Type "req" correctly
  signin(@Req() req: { user: any }) {
    return this.authService.signin(req.user);
  }

  // TODO: Implement signup

  // TODO: Implement refresh

  // TODO: Implement logout
}
