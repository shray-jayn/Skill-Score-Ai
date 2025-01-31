import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;
}