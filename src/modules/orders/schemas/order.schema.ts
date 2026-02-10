import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus, StationType } from '../../../common/constants';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderStaff {
  @Prop()
  name: string;

  @Prop()
  avatar: string;

  @Prop({ type: Types.ObjectId, ref: 'Staff' })
  staffId: Types.ObjectId;
}

@Schema({ _id: true })
export class OrderItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;

  @Prop({ enum: Object.values(StationType) })
  stationType: string;

  @Prop()
  stationName: string;
}

@Schema({ _id: false })
export class OrderPaymentMethod {
  @Prop()
  type: string;

  @Prop()
  last4: string;

  @Prop()
  processedAt: string;

  @Prop()
  status: string;
}

@Schema({ _id: true })
export class OrderTimeline {
  @Prop({ required: true })
  title: string;

  @Prop({ default: () => new Date() })
  time: Date;

  @Prop()
  description: string;

  @Prop({ default: 'default' })
  status: string;
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
  orgId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  orderId: string;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop()
  table: string;

  @Prop({ type: OrderStaff })
  staff: OrderStaff;

  @Prop({
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  })
  status: string;

  @Prop({ type: [OrderItem], default: [] })
  items: OrderItem[];

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ default: 0 })
  total: number;

  @Prop({ type: OrderPaymentMethod })
  paymentMethod: OrderPaymentMethod;

  @Prop({ type: [OrderTimeline], default: [] })
  timeline: OrderTimeline[];

  @Prop()
  type: string; // 'STAFF' | 'MOBILE'

  @Prop()
  customer: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ orgId: 1, branchId: 1, status: 1 });
OrderSchema.index({ orgId: 1, branchId: 1, createdAt: -1 });
OrderSchema.index({ orderId: 1 }, { unique: true });
OrderSchema.index({ orgId: 1, 'items.stationType': 1, status: 1 });
