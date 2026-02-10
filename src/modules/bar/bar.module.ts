import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { BarController } from './bar.controller';
import { BarService } from './bar.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [BarController],
  providers: [BarService],
  exports: [BarService],
})
export class BarModule {}
