import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { StaffStatus } from '../../../common/constants';

export class QueryStaffDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by role', example: 'kitchen' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ description: 'Filter by branch ID', example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiPropertyOptional({ description: 'Filter by status', enum: StaffStatus })
  @IsOptional()
  @IsIn(Object.values(StaffStatus))
  status?: string;
}
