import { Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post()
  create() {
    // Registration logic goes here
    return { message: 'User created successfully' };
  }
}
