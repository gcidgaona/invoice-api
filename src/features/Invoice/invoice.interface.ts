import { Types } from 'mongoose';

export interface Invoice {
  _id?: Types.ObjectId;
  amount: number;
  date: string;
  userTo: string;
  status: string;
  userFrom: string;
  category?: string;
  description?: string;
}
