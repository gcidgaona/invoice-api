import { Types } from "mongoose";

export interface INotification {
  id?: Types.ObjectId;
  title: string;
  content: string;
  extras: any;
  hasReaded: boolean;
  type: string;
}

export interface IUser {
  name: string;
  userEmail: string;
  notifications?: INotification[];
  friends?: string[];
}

export interface IFriend {
  nombre: string;
  pendingPayFrom: boolean;
  pendingPayTo: boolean;
}
