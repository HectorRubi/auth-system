import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { Auth } from './entities/auth.entity';
import { TokenService } from './services/token.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), ConfigModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
})
export class AuthModule {}
