import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email address', example: 'admin@restaurant.com' })
  @IsEmail({}, { message: 'Enter a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'securePass123' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
