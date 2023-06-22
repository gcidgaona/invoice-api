import { Injectable } from '@nestjs/common';
import { IConsolid } from './consolid.interface';
import { Invoice as IInvoice } from '../Invoice/invoice.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoicesDocument } from '../Invoice/invoice.schema';
import { User as UserSchema, UsersDocument } from '../user/user.schema';
import { INotification } from '../user/user.interface';
import {
  UNPAID_STATE,
  PENDING_STATE,
  PAID_STATE,
} from '../../constants/globals';

@Injectable()
export class ConsolidService {
  constructor(
    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoicesDocument>,
    @InjectModel(UserSchema.name)
    private userModel: Model<UsersDocument>,
  ) {}

  public async consolidDebt(user: string, userTo: string): Promise<IConsolid> {
    if (user === '' || userTo === '' || user === 'null' || userTo === 'null')
      return null;
    const responseUser = await this.invoiceModel.find({
      userFrom: userTo,
      userTo: user,
      $or: [{ status: UNPAID_STATE }, { status: PENDING_STATE }],
    });
    const responseUserTo = await this.invoiceModel.find({
      userFrom: user,
      userTo: userTo,
      $or: [{ status: UNPAID_STATE }, { status: PENDING_STATE }],
    });
    const totalUser = responseUser
      .filter((invoice) => invoice.status === UNPAID_STATE)
      .reduce((prev, current) => {
        return prev + current.amount;
      }, 0);
    const totalUserTo = responseUserTo
      .filter((invoice) => invoice.status === UNPAID_STATE)
      .reduce((prev, current) => {
        return prev + current.amount;
      }, 0);

    const getTotal = totalUserTo - totalUser;

    return {
      totalDebt: getTotal,
      userDebts: responseUser,
      userToDebts: responseUserTo,
    };
  }

  public createNotification(type: string, userFrom: string): INotification {
    if ((type = 'CONFIRMACION'))
      return {
        title: 'Un pago necesita confirmacion!',
        content: `${userFrom} a generado un pago`,
        extras: {
          user: userFrom,
        },
        hasReaded: false,
        type: 'CONFIRMACION',
        id: new Types.ObjectId(),
      };
  }
  async resetValues(user: string, userTo: string): Promise<boolean> {
    await this.userModel.updateOne(
      { name: user, 'friends.name': userTo },
      {
        $set: {
          'friends.$.confirmPay': false,
          'friends.$.confirmToPay': false,
          'friends.$.pendingConfirm': false,
        },
      },
    );
    await this.userModel.updateOne(
      { name: userTo, 'friends.name': user },
      {
        $set: {
          'friends.$.confirmPay': false,
          'friends.$.confirmToPay': false,
          'friends.$.pendingConfirm': false,
        },
      },
    );
    return true;
  }
  public async payDebt(
    user: string,
    userTo: string,
    userDebt: IInvoice[],
    userToDebt: IInvoice[],
  ): Promise<boolean> {
    try {
      this.resetValues(user, userTo);
      const getIdsUser = userDebt.map((item) => item._id);
      const getIdsUserTo = userToDebt.map((item) => item._id);

      await this.invoiceModel.updateMany(
        {
          userFrom: userTo,
          userTo: user,
          status: UNPAID_STATE,
          _id: { $in: getIdsUser },
        },
        {
          $set: { status: PENDING_STATE },
        },
      );
      await this.invoiceModel.updateMany(
        {
          userFrom: user,
          userTo: userTo,
          status: UNPAID_STATE,
          _id: { $in: getIdsUserTo },
        },
        {
          $set: { status: PENDING_STATE },
        },
      );
      await this.userModel.updateOne(
        { name: user, 'friends.name': userTo },
        {
          $set: {
            'friends.$.confirmPay': true,
            'friends.$.pendingConfirm': true,
          },
        },
      );
      await this.userModel.updateOne(
        { name: userTo, 'friends.name': user },
        {
          $set: {
            'friends.$.confirmPay': true,
            'friends.$.pendingConfirm': true,
          },
        },
      );
      const getNotification = this.createNotification('CONFIRMACION', user);
      await this.userModel.findOneAndUpdate(
        { name: userTo },
        { $push: { notifications: getNotification } },
      );
      return true;
    } catch {
      return false;
    }
  }

  public async confirmDebt(
    user: string,
    userTo: string,
    userDebt: IInvoice[],
    userToDebt: IInvoice[],
    idNot: string,
  ): Promise<boolean> {
    try {
      const getIdsUser = userDebt.map((item) => item._id);
      const getIdsUserTo = userToDebt.map((item) => item._id);

      await this.invoiceModel.updateMany(
        {
          userFrom: userTo,
          userTo: user,
          status: PENDING_STATE,
          _id: { $in: getIdsUser },
        },
        {
          $set: { status: PAID_STATE },
        },
      );
      await this.invoiceModel.updateMany(
        {
          userFrom: user,
          userTo: userTo,
          status: PENDING_STATE,
          _id: { $in: getIdsUserTo },
        },
        {
          $set: { status: PAID_STATE },
        },
      );
      await this.userModel.updateOne(
        { name: user, 'friends.name': userTo },
        {
          $set: {
            'friends.$.confirmToPay': true,
            'friends.$.pendingConfirm': false,
          },
        },
      );
      await this.userModel.updateOne(
        { name: userTo, 'friends.name': user },
        {
          $set: {
            'friends.$.confirmToPay': true,
            'friends.$.pendingConfirm': false,
          },
        },
      );

      const parseId = new Types.ObjectId(idNot);

      await this.userModel.findOneAndUpdate(
        { name: user },
        { $pull: { notifications: { id: parseId } } },
      );
      return true;
    } catch {
      return false;
    }
  }
}
