import { Controller, Param, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

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

  @Get('validate/:uuid')
  validate(@Param('uuid') uuid: string) {
    // Validation logic goes here
    return { message: 'User validated successfully', uuid };
  }

  @Post('refresh-token')
  refreshToken() {
    // Refresh token logic goes here
    return { message: 'Token refreshed successfully' };
  }
}
