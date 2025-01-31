import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { USER_MESSAGES } from './constants/messages';
import { ConfigService } from '@nestjs/config';
import { AuthResponse } from './interfaces/auth-response.interface';
import { v4 as uuidv4 } from 'uuid';  

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    try {
      const { name, email, password} = registerUserDto;

      const existingUser = await this.prisma.userData.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new UnauthorizedException({
          message: USER_MESSAGES.EMAIL_ALREADY_EXISTS,
          code: 'EMAIL_ALREADY_EXISTS',
        });
      }

        const hashedPassword = await bcrypt.hash(password, 10);
        const image = "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg";
        const designation = "TEACHER";

      const user = await this.prisma.userData.create({
        data: {
          userId: uuidv4(), 
          email,
          name,
          password: hashedPassword,
          designation: designation,
          image: image,
        },
      });

      const token = this.generateToken(user);

      return {
        message: USER_MESSAGES.REGISTER_SUCCESS,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          designation: user.designation,
          image: user.image,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    try {
      const { email, password } = loginUserDto;

      const user = await this.prisma.userData.findUnique({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException({
          message: USER_MESSAGES.INVALID_CREDENTIALS,
          code: 'INVALID_CREDENTIALS',
        });
      }

      const token = this.generateToken(user);

      return {
        message: USER_MESSAGES.LOGIN_SUCCESS,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          designation: user.designation,
          image: user.image,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  private generateToken(user: { userId: string; email: string }): string {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const expiresIn = this.configService.get<string | number>('JWT_EXPIRES_IN_SECONDS');

      const payload = { sub: user.userId, email: user.email };

      return this.jwtService.sign(payload, {
        secret,
        expiresIn: Number(expiresIn),
      });
    } catch (error) {
      throw error;
    }
  }
}