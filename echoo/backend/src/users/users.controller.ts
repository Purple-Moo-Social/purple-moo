import { Controller, Body, Post } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: { email: string; password: string }) {
    return await this.usersService.create(createUserDto);
  }
}
