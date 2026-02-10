import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryKitchenOrdersDto {
  @ApiPropertyOptional({ description: 'Filter by station name', example: 'grill' })
  @IsOptional()
  @IsString()
  station?: string;
}
