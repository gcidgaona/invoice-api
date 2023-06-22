import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InvoicesDocument = HydratedDocument<Invoice>;

@Schema()
export class Invoice {
  @Prop()
  amount: number;

  @Prop()
  date: string;

  @Prop()
  userTo: string;

  @Prop()
  status: string;

  @Prop()
  userFrom: string;

  @Prop({ required: false })
  category: string;

  @Prop({ required: false })
  description: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
