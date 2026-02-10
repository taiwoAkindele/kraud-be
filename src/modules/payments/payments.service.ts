import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { PaymentStatus } from '../../common/constants';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(orgId: string, dto: CreatePaymentDto) {
    return this.paymentModel.create({
      orgId,
      orderId: dto.orderId,
      amount: dto.amount,
      method: dto.method,
      status: PaymentStatus.COMPLETED,
      processedAt: new Date(),
    });
  }

  async findById(orgId: string, paymentId: string) {
    const payment = await this.paymentModel
      .findOne({ _id: paymentId, orgId })
      .populate('orderId')
      .lean()
      .exec();
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async updateStatus(
    orgId: string,
    paymentId: string,
    dto: UpdatePaymentStatusDto,
  ) {
    const payment = await this.paymentModel
      .findOneAndUpdate(
        { _id: paymentId, orgId },
        { status: dto.status },
        { new: true },
      )
      .lean()
      .exec();
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}
