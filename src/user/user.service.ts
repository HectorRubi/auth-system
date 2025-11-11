import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../environment.model';

@Injectable()
export class UserService {
  constructor(private configService: ConfigService<EnvironmentVariables>) {}

  create() {}
}
