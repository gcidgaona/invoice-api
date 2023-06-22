import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { INotification } from './user.interface';

export type UsersDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  userEmail: string;

  @Prop({ required: false })
  friends: string[];
  @Prop({ required: false })
  notifications: INotification[];
}

export const UserSchema = SchemaFactory.createForClass(User);
