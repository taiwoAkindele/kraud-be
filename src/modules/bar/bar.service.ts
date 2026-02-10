import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { UpdateBarStatusDto } from './dto/update-bar-status.dto';
import { OrderStatus } from '../../common/constants';
import { ORDER_STATUS_UPDATED } from '../events/events.constants';

@Injectable()
export class BarService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async getOrders(orgId: string) {
    return this.orderModel
      .find({
        orgId,
        status: { $in: [OrderStatus.PENDING, OrderStatus.IN_PREP] },
        'items.stationType': { $in: ['bar', 'beverage'] },
      })
      .sort({ createdAt: 1 })
      .lean()
      .exec();
  }

  async updateOrderStatus(
    orgId: string,
    orderId: string,
    dto: UpdateBarStatusDto,
  ) {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: orderId, orgId },
      {
        status: dto.status,
        $push: {
          timeline: {
            title: `Bar: ${dto.status}`,
            time: new Date(),
            description: `Bar updated status to ${dto.status}`,
            status: 'success',
          },
        },
      },
      { new: true },
    );

    if (!order) throw new NotFoundException('Order not found');

    this.eventEmitter.emit(ORDER_STATUS_UPDATED, {
      orderId: order._id,
      branchId: order.branchId,
      status: dto.status,
      items: order.items,
      orgId,
    });

    return order;
  }
}
