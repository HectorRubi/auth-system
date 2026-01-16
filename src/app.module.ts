import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EnvironmentVariables } from './config/environment-variables';
import configuration from './config/configurations';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: 'postgres',
        host: configService.get('database.host', { infer: true }),
        port: configService.get('database.port', { infer: true }),
        username: configService.get('database.username', { infer: true }),
        password: configService.get('database.password', { infer: true }),
        database: configService.get('database.database', { infer: true }),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
