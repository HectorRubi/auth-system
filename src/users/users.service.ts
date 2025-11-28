import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ username });
  }

  async create(body: CreateUserDto) {
    // Create username variable for easier access
    const username = body.username;

    // Check if user with the same username already exists
    const existingUser = await this.findByUsername(username);

    if (existingUser) {
      throw new ConflictException(
        'Unable to create user account. Please try again or contact support.',
      );
    }

    // User creation
    const user = this.userRepository.create();

    const password = body.password;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    user.username = username;
    user.password = hashedPassword;
    user.salt = salt;

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.uuid,
      username: savedUser.username,
    };
  }
}
