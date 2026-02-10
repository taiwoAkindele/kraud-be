import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { OrderStatus } from '../../../common/constants';

export class QueryOrdersDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by order status', enum: OrderStatus })
  @IsOptional()
  @IsIn(Object.values(OrderStatus))
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by branch ID', example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  branch?: string;
}
