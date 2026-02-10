import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Email address', example: 'admin@restaurant.com' })
  @IsEmail({}, { message: 'Enter a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
