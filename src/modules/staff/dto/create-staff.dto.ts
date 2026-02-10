import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StaffRole } from '../../../common/constants';

export class CreateStaffDto {
  @ApiProperty({ description: 'Full name', example: 'Jane Smith', minLength: 2, maxLength: 100 })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(100, { message: 'Full name must be less than 100 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message:
      'Full name can only contain letters, spaces, hyphens, and apostrophes',
  })
  fullName: string;

  @ApiProperty({ description: 'Email address', example: 'jane@restaurant.com' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  @MaxLength(255, { message: 'Email must be less than 255 characters' })
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @ApiProperty({ description: 'Staff role', enum: StaffRole, example: 'kitchen' })
  @IsString()
  @IsNotEmpty({ message: 'Role selection is required' })
  @IsIn(Object.values(StaffRole), {
    message: 'Please select a valid role',
  })
  role: string;

  @ApiProperty({ description: 'Branch IDs to assign', example: ['507f1f77bcf86cd799439011'], type: [String] })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one branch must be selected' })
  @ArrayMaxSize(10, { message: 'Cannot select more than 10 branches' })
  @IsString({ each: true })
  selectedBranches: string[];
}
