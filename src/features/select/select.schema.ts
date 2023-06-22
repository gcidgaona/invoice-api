import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SelectsDocument = HydratedDocument<Select>;

@Schema()
export class Select {
  @Prop()
  type: string;
  @Prop({ required: false })
  body: string[];
}

export const SelectSchema = SchemaFactory.createForClass(Select);
