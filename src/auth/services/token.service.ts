import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/environment.model';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(readonly configService: ConfigService<EnvironmentVariables>) {}

  getTokenSecretKey(): string {
    const secretKey = this.configService.get('JWT_SECRET', {
      infer: true,
    });

    if (!secretKey) {
      throw new InternalServerErrorException(
        'Unable to login at this time. Please try again later.',
      );
    }

    return secretKey;
  }

  generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      name: user.username,
    };

    const secretKey = this.getTokenSecretKey();

    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: '10m',
    });

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
