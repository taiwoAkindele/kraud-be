import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { Station, StationDocument } from './schemas/station.schema';
import { UpdateKitchenStatusDto } from './dto/update-kitchen-status.dto';
import { QueryKitchenOrdersDto } from './dto/query-kitchen-orders.dto';
import { OrderStatus } from '../../common/constants';
import { ORDER_STATUS_UPDATED } from '../events/events.constants';

@Injectable()
export class KitchenService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    @InjectModel(Station.name)
    private stationModel: Model<StationDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async getOrders(orgId: string, query: QueryKitchenOrdersDto) {
    const filter: FilterQuery<Order> = {
      orgId,
      status: { $in: [OrderStatus.PENDING, OrderStatus.IN_PREP] },
    };

    if (query.station) {
      filter['items.stationType'] = query.station;
    }

    return this.orderModel.find(filter).sort({ createdAt: 1 }).lean().exec();
  }

  async getOrderById(orgId: string, orderId: string) {
    const order = await this.orderModel
      .findOne({ _id: orderId, orgId })
      .lean()
      .exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(
    orgId: string,
    orderId: string,
    dto: UpdateKitchenStatusDto,
  ) {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: orderId, orgId },
      {
        status: dto.status,
        $push: {
          timeline: {
            title: `Kitchen: ${dto.status}`,
            time: new Date(),
            description: `Kitchen updated status to ${dto.status}`,
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

  async getStations(orgId: string) {
    return this.stationModel.find({ orgId, active: true }).lean().exec();
  }
}
