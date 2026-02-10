import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
  orgId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  userCount: number;

  @Prop({ type: Map, of: Boolean, default: {} })
  permissions: Map<string, boolean>;

  @Prop()
  lastEditedBy: string;

  @Prop()
  lastEditedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.index({ orgId: 1, name: 1 }, { unique: true });
