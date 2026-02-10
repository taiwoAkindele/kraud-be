import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BranchStatus } from '../../../common/constants';

export class QueryBranchesDto {
  @ApiPropertyOptional({ description: 'Filter by status', enum: BranchStatus })
  @IsOptional()
  @IsIn(Object.values(BranchStatus))
  status?: string;
}
