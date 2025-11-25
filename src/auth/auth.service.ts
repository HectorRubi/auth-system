import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { EnvironmentVariables } from 'src/environment.model';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Auth } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly usersService: UsersService,
  ) {}

  async login(body: LoginDto) {
    const username = body.username;
    const password = body.password;

    // Validate user credentials in DB
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Generate JWT access token
    const accessToken = this.generateAccessToken(user);

    // Generate Refresh token
    const {
      token: refreshToken,
      tokenHash,
      expiresAt,
    } = this.generateRefreshToken();

    // Store auth data
    const auth = this.authRepository.create();
    auth.user = user;
    auth.tokenHash = tokenHash;
    auth.expiresAt = expiresAt;
    await this.authRepository.save(auth);

    return { refreshToken, accessToken };
  }

  async refreshToken(body: RefreshTokenDto) {
    const authUser = await this.authRepository.findOneBy({
      tokenHash: this.generateRefreshTokenHash(body.refreshToken),
    });

    if (!authUser || authUser.expiresAt < new Date()) {
      throw new BadRequestException('The refresh token has expired.');
    }

    const accessToken = this.generateAccessToken(authUser.user);
    const {
      token: refreshToken,
      tokenHash,
      expiresAt,
    } = this.generateRefreshToken();

    authUser.tokenHash = tokenHash;
    authUser.expiresAt = expiresAt;
    await this.authRepository.save(authUser);

    return { refreshToken, accessToken };
  }

  private generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      name: user.username,
    };

    const secretKey = this.configService.get('JWT_SECRET', {
      infer: true,
    });

    if (!secretKey) {
      throw new InternalServerErrorException(
        'Unable to login at this time. Please try again later.',
      );
    }

    const accessToken = jwt.sign(payload, secretKey, {
      expiresIn: '10m',
    });

    return accessToken;
  }

  private generateRefreshToken(): {
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

  private generateRefreshTokenHash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
