import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnvironmentVariables } from 'src/config/environment-variables';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    readonly configService: ConfigService<EnvironmentVariables>,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      name: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
  }

  generateRefreshToken(): {
    token: string;
    tokenHash: string;
    expiresAt: Date;
  } {
    const token = crypto.randomBytes(64).toString('hex');

    const tokenHash = this.generateRefreshTokenHash(token);

    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const expiresMs = SEVEN_DAYS;

    const expiresAt = new Date(Date.now() + expiresMs);

    return {
      token,
      tokenHash,
      expiresAt,
    };
  }

  generateRefreshTokenHash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
