import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Auth } from '../entities/auth.entity';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
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
    const accessToken = this.tokenService.generateAccessToken(user);

    // Generate Refresh token
    const {
      token: refreshToken,
      tokenHash,
      expiresAt,
    } = this.tokenService.generateRefreshToken();

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
      tokenHash: this.tokenService.generateRefreshTokenHash(body.refreshToken),
    });

    if (!authUser || authUser.expiresAt < new Date()) {
      throw new BadRequestException('The refresh token has expired.');
    }

    const accessToken = this.tokenService.generateAccessToken(authUser.user);
    const {
      token: refreshToken,
      tokenHash,
      expiresAt,
    } = this.tokenService.generateRefreshToken();

    authUser.tokenHash = tokenHash;
    authUser.expiresAt = expiresAt;
    await this.authRepository.save(authUser);

    return { refreshToken, accessToken };
  }
}
