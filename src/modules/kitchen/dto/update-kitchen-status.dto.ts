import { IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { KitchenOrderStatus } from '../../../common/constants';

export class UpdateKitchenStatusDto {
  @ApiProperty({ description: 'Kitchen order status', enum: KitchenOrderStatus, example: 'in_prep' })
  @IsNotEmpty()
  @IsIn(Object.values(KitchenOrderStatus))
  status: string;
}
