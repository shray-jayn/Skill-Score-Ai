import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
 
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    return await this.userService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    return await this.userService.login(loginUserDto);
  }
}
