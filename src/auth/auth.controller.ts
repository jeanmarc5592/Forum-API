import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  // TODO: Type "req" correctly
  login(@Req() req: { user: any }) {
    const accessToken = this.authService.generateAccessToken(req.user);

    // TODO: Create refreshToken and add to response

    return {
      accessToken,
    };
  }

  // TODO: Implement signup

  // TODO: Implement refresh

  // TODO: Implement logout
}
