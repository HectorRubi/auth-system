import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { LogOutDto } from '../dto/logout.dto';
import { AuthGuard } from '../guards/auth.guard';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: express.Request, @Body() body: LogOutDto) {
    const userId = req.user.sub;
    return await this.authService.logout(body, userId);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return await this.authService.refreshToken(body);
  }
}
