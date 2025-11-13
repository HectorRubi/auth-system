import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../environment.model';

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService<EnvironmentVariables>) {}

  create() {}
}
