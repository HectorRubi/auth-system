import { Controller, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Post()
  create() {
    // Registration logic goes here
    return { message: 'User created successfully' };
  }
}
