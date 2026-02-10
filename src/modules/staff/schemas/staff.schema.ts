import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StaffDisplayRole, StaffStatus } from '../../../common/constants';

export type StaffDocument = Staff & Document;

@Schema({ _id: false })
export class StaffPerformance {
  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalOrders: number;

  @Prop({ default: 0 })
  efficiencyRate: number;

  @Prop({ default: 0 })
  efficiencyChange: number;

  @Prop({ default: 0 })
  errorMargin: number;

  @Prop({ default: 0 })
  errorMarginChange: number;

  @Prop({ default: 0 })
  attendance: number;

  @Prop({ default: 0 })
  attendanceChange: number;
}

@Schema({ _id: true })
export class StaffFeedback {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: () => new Date() })
  date: Date;

  @Prop()
  icon: string;
}

@Schema({ _id: true })
export class StaffSkill {
  @Prop({ required: true })
  name: string;
}

@Schema({ _id: false })
export class StaffOrganizational {
  @Prop()
  joinedDate: string;

  @Prop()
  manager: string;

  @Prop({ type: Types.ObjectId, ref: 'Staff' })
  managerId: Types.ObjectId;

  @Prop()
  shiftType: string;

  @Prop()
  employeeId: string;
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Staff {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
  orgId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({
    required: true,
    enum: Object.values(StaffDisplayRole),
  })
  role: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Branch' }], default: [] })
  branches: Types.ObjectId[];

  @Prop({
    enum: Object.values(StaffStatus),
    default: StaffStatus.ACTIVE,
  })
  status: string;

  @Prop()
  avatarUrl: string;

  @Prop()
  joinedDate: Date;

  @Prop({ type: StaffPerformance, default: () => ({}) })
  performance: StaffPerformance;

  @Prop({ type: [StaffFeedback], default: [] })
  feedback: StaffFeedback[];

  @Prop({ type: [StaffSkill], default: [] })
  skills: StaffSkill[];

  @Prop({ type: StaffOrganizational, default: () => ({}) })
  organizational: StaffOrganizational;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);

StaffSchema.index({ orgId: 1, email: 1 }, { unique: true });
StaffSchema.index({ orgId: 1, status: 1, role: 1 });
StaffSchema.index({ branches: 1 });
