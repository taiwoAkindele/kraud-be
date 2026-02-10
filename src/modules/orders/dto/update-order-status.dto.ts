import { IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../../common/constants';

export class UpdateOrderStatusDto {
  @ApiProperty({ description: 'Order status', enum: OrderStatus, example: 'in_prep' })
  @IsNotEmpty()
  @IsIn(Object.values(OrderStatus))
  status: string;
}
