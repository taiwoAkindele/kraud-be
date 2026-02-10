import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BranchType } from '../../../common/constants';

export class CreateBranchDto {
  @ApiProperty({ description: 'Branch name', example: 'Downtown Branch' })
  @IsString()
  @IsNotEmpty({ message: 'Branch Name is required' })
  branchName: string;

  @ApiProperty({ description: 'Branch type', enum: BranchType, example: 'Full Service' })
  @IsString()
  @IsNotEmpty({ message: 'Branch Type is required' })
  @IsIn(Object.values(BranchType))
  branchType: string;

  @ApiProperty({ description: 'Branch manager ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty({ message: 'Branch Manager is required' })
  branchManager: string;

  @ApiProperty({ description: 'Branch location', example: '123 Main St, City' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ description: 'Opening time', example: '09:00' })
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiPropertyOptional({ description: 'Closing time', example: '22:00' })
  @IsOptional()
  @IsString()
  closeTime?: string;
}
