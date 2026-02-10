import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BranchType, BranchStatus } from '../../../common/constants';

export type BranchDocument = Branch & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Branch {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
  orgId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    enum: Object.values(BranchType),
  })
  type: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'Staff' })
  manager: Types.ObjectId;

  @Prop()
  managerImg: string;

  @Prop({
    enum: Object.values(BranchStatus),
    default: BranchStatus.ACTIVE,
  })
  status: string;

  @Prop()
  openTime: string;

  @Prop()
  closeTime: string;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);

BranchSchema.index({ orgId: 1, status: 1 });
