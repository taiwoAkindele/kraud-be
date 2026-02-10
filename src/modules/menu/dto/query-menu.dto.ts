import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryMenuDto {
  @ApiPropertyOptional({ description: 'Filter by branch ID', example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiPropertyOptional({ description: 'Filter by category', example: 'Main Course' })
  @IsOptional()
  @IsString()
  category?: string;
}
