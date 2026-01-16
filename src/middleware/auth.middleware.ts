import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { EnvironmentVariables } from 'src/config/environment-variables';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  use(request: Request, response: Response, next: () => void) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('User is not authorized.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('User is not authorized.');
    }

    try {
      const payload = jwt.verify(token, this.getSecretKey());
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('User is not authorized.');
    }

    next();
  }

  private getSecretKey(): string {
    const secretKey = this.configService.get('jwt.secret', {
      infer: true,
    });

    if (!secretKey) {
      throw new InternalServerErrorException(
        'Unable to login at this time. Please try again later.',
      );
    }

    return secretKey;
  }
}
