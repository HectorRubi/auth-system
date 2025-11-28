import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('logout')
  logout() {
    // Logout logic goes here
    return { message: 'User logged out successfully' };
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return await this.authService.refreshToken(body);
  }
}
