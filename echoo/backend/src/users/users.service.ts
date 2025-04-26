import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs'; // Changed from bcrypt to bcryptjs for better TypeScript support

@Injectable()
export class UsersService {
  private usersRepository: Repository<User>;
  constructor(private dataSource: DataSource) {
    this.usersRepository = this.dataSource.getRepository(User);
  }

  async create(user: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.usersRepository.save({
      email: user.email,
      password: hashedPassword,
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return (
      (await this.usersRepository.findOne({ where: { email } })) ?? undefined
    );
  }
}
