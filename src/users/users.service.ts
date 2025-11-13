/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(body: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { username: body.username },
    });

    if (existingUser) {
      throw new ConflictException(
        'Unable to create user account. Please try again or contact support.',
      );
    }

    const user = this.userRepository.create();

    const username = body.username;
    const password = body.password;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    user.username = username;
    user.password = hashedPassword;
    user.salt = salt;

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      username: savedUser.username,
    };
  }
}
