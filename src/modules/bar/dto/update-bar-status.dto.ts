import { IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KitchenOrderStatus } from '../../../common/constants';

export class UpdateBarStatusDto {
  @ApiProperty({ description: 'Bar order status', enum: KitchenOrderStatus, example: 'ready' })
  @IsNotEmpty()
  @IsIn(Object.values(KitchenOrderStatus))
  status: string;
}
