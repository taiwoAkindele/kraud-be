import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsBoolean,
  Equals,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Organization name', example: 'My Restaurant' })
  @IsString()
  @IsNotEmpty({ message: 'Organization name is required' })
  org_name: string;

  @ApiProperty({ description: 'Admin user name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Admin name is required' })
  admin_name: string;

  @ApiProperty({ description: 'Admin email address', example: 'admin@restaurant.com' })
  @IsEmail({}, { message: 'Enter a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ description: 'Password (min 8 characters)', example: 'securePass123' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({ description: 'Accept terms and conditions', example: true })
  @IsBoolean()
  @Equals(true, { message: 'You must accept the terms' })
  terms: boolean;
}
