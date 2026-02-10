import { IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../../../common/constants';

export class UpdatePaymentStatusDto {
  @ApiProperty({ description: 'Payment status', enum: PaymentStatus, example: 'completed' })
  @IsNotEmpty()
  @IsIn(Object.values(PaymentStatus))
  status: string;
}
