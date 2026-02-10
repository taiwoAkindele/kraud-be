import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { DispatchOrderDto } from './dto/dispatch-order.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { QueryOrderHistoryDto } from './dto/query-order-history.dto';
import { OrderStatus } from '../../common/constants';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import {
  ORDER_CREATED,
  ORDER_DISPATCHED,
  ORDER_STATUS_UPDATED,
} from '../events/events.constants';

@Injectable()
export class OrdersService {
  private orderCounter = 0;

  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(orgId: string, query: QueryOrdersDto) {
    const { page, limit, sortBy, sortOrder, status, branch } = query;
    const filter: FilterQuery<Order> = { orgId };

    if (status) filter.status = status;
    if (branch) filter.branchId = branch;

    const [data, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    return PaginatedResponseDto.create(data, total, page, limit);
  }

  async findById(orgId: string, orderId: string) {
    const order = await this.orderModel
      .findOne({ _id: orderId, orgId })
      .lean()
      .exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(orgId: string, dto: CreateOrderDto, user: any) {
    const orderId = await this.generateOrderId();

    const items = dto.items.map((item) => ({
      ...item,
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const order = await this.orderModel.create({
      orgId,
      orderId,
      branchId: dto.branchId,
      table: dto.tableNumber,
      customer: dto.customer,
      staff: {
        name: user.name || 'Staff',
        staffId: user.userId,
      },
      status: OrderStatus.PENDING,
      items,
      subtotal,
      tax,
      total,
      type: 'STAFF',
      timeline: [
        {
          title: 'Order Created',
          time: new Date(),
          description: 'Order has been placed',
          status: 'success',
        },
      ],
    });

    this.eventEmitter.emit(ORDER_CREATED, {
      orderId: order._id,
      branchId: dto.branchId,
      items: order.items,
      orgId,
    });

    return order;
  }

  async update(orgId: string, orderId: string, dto: UpdateOrderDto) {
    const raw = dto as any;
    const updateData: any = {};
    if (raw.items) {
      updateData.items = raw.items;
      const subtotal = raw.items.reduce(
        (sum: any, item: any) => sum + item.price * item.quantity,
        0,
      );
      updateData.subtotal = subtotal;
      updateData.tax = subtotal * 0.1;
      updateData.total = subtotal + updateData.tax;
    }
    if (raw.tableNumber) updateData.table = raw.tableNumber;

    const order = await this.orderModel
      .findOneAndUpdate({ _id: orderId, orgId }, updateData, { new: true })
      .lean()
      .exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(
    orgId: string,
    orderId: string,
    dto: UpdateOrderStatusDto,
  ) {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: orderId, orgId },
      {
        status: dto.status,
        $push: {
          timeline: {
            title: `Status changed to ${dto.status}`,
            time: new Date(),
            description: `Order status updated to ${dto.status}`,
            status: dto.status === OrderStatus.CANCELLED ? 'error' : 'success',
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

  async delete(orgId: string, orderId: string) {
    const result = await this.orderModel
      .findOneAndDelete({ _id: orderId, orgId })
      .exec();
    if (!result) throw new NotFoundException('Order not found');
    return { message: 'Order recalled successfully' };
  }

  async getHistory(orgId: string, query: QueryOrderHistoryDto) {
    const { page, limit, sortBy, sortOrder, dateFrom, dateTo, branch, orderStatus } =
      query;
    const filter: FilterQuery<Order> = { orgId };

    if (branch) filter.branchId = branch;
    if (orderStatus) filter.status = orderStatus;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('branchId', 'name')
        .lean()
        .exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    return PaginatedResponseDto.create(data, total, page, limit);
  }

  async getHistoryDetail(orgId: string, orderId: string) {
    const order = await this.orderModel
      .findOne({ _id: orderId, orgId })
      .populate('branchId', 'name')
      .lean()
      .exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async dispatch(orgId: string, orderId: string, dto: DispatchOrderDto) {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: orderId, orgId },
      {
        status: OrderStatus.IN_PREP,
        $push: {
          timeline: {
            title: 'Order Dispatched',
            time: new Date(),
            description: 'Order sent to kitchen/bar stations',
            status: 'success',
          },
        },
      },
      { new: true },
    );

    if (!order) throw new NotFoundException('Order not found');

    this.eventEmitter.emit(ORDER_DISPATCHED, {
      orderId: order._id,
      branchId: order.branchId,
      items: order.items,
      dispatchItems: dto.items,
      orgId,
    });

    return order;
  }

  async processPayment(
    orgId: string,
    orderId: string,
    dto: ProcessPaymentDto,
  ) {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: orderId, orgId },
      {
        paymentMethod: {
          type: dto.paymentMethod,
          processedAt: new Date().toISOString(),
          status: 'completed',
        },
        status: OrderStatus.COMPLETED,
        $push: {
          timeline: {
            title: 'Payment Processed',
            time: new Date(),
            description: `Payment of $${dto.amount} via ${dto.paymentMethod}`,
            status: 'success',
          },
        },
      },
      { new: true },
    );

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  private async generateOrderId(): Promise<string> {
    this.orderCounter++;
    const count = await this.orderModel.countDocuments().exec();
    const num = count + this.orderCounter;
    return `#ORD-${String(num).padStart(4, '0')}`;
  }
}
