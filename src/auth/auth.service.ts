import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../environment.model';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService<EnvironmentVariables>) {}
}
