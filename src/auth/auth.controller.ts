import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';

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

  // TODO: Implement refresh

  // TODO: Implement logout
}
