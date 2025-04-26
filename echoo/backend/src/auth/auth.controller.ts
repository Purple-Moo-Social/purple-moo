import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
// import { Request as ExpressRequest } from 'express';
import { LoginDto } from '@/users/dto/login.dto';
import { CurrentUser } from './decorators/user.decorator';
// import { CreateUserDto } from '../users/dto/create-user.dto';

interface JwtPayload {
  id: string;
  email: string;
}
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('protected')
  protectedRoute(@CurrentUser() user: JwtPayload) {
    return {
      message: 'Secure data',
      user,
    };
  }
}
