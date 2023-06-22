import { Injectable, NotFoundException } from '@nestjs/common';
import { Invoice } from './invoice.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice as InvoiceSchema, InvoicesDocument } from './invoice.schema';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(InvoiceSchema.name)
    private invoiceModel: Model<InvoicesDocument>,
  ) {}

  public async getInvoices(user: string): Promise<Invoice[]> {
    if (user === '') return [];
    return await this.invoiceModel.find({ userTo: user });
  }
  public async getLastTenInvoices(user: string): Promise<Invoice[]> {
    if (user === '') return [];
    return await this.invoiceModel
      .find({ userTo: user }, {}, { limit: 10 })
      .sort({ _id: -1 });
  }
  public async getTotalDebt(user: string): Promise<number> {
    if (user === '') return 0;
    const response = await this.invoiceModel.find({ userTo: user });
    return response.reduce((prev, current) => {
      return prev + current.amount;
    }, 0);
  }

  public async getTotalMonth(user: string): Promise<number> {
    if (user === '') return 0;
    const firstDay = dayjs().startOf('month').format('YYYY-MM-DD');
    const lastDay = dayjs().endOf('month').format('YYYY-MM-DD');
    const response = await this.invoiceModel.find({
      userTo: user,
      date: {
        $gte: firstDay,
        $lt: lastDay,
      },
    });
    return response?.reduce((prev, current) => {
      return prev + current.amount;
    }, 0);
  }

  public async postNewInvoice(
    user: string,
    invoice: Invoice,
  ): Promise<Invoice> {
    if (user === '') return null;
    const newInvoiceDb = new this.invoiceModel(invoice);
    return newInvoiceDb.save();
  }

  public async deleteInvoice(user: string, id: string): Promise<Invoice> {
    if (user === '') return null;
    const response = await this.invoiceModel.findByIdAndRemove(id);
    if (!response) {
      throw new NotFoundException(`Invoice #${id} not found`);
    }
    return response;
  }
}
