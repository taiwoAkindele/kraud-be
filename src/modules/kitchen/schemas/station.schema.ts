import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StationType } from '../../../common/constants';

export type StationDocument = Station & Document;

@Schema({ timestamps: true })
export class Station {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
  orgId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: Object.values(StationType) })
  type: string;

  @Prop({ default: true })
  active: boolean;
}

export const StationSchema = SchemaFactory.createForClass(Station);

StationSchema.index({ orgId: 1, type: 1 });
