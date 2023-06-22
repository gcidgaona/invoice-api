import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Invoice } from './invoice.interface';
import { InvoiceService } from './invoice.service';

@Controller('/')
export class InvoiceController {
  @Inject(InvoiceService)
  private readonly invoiceService: InvoiceService;

  @Get('/invoice/getInvoices/:user')
  getInvoices(@Param('user') user: string): Promise<Invoice[]> {
    return this.invoiceService.getInvoices(user);
  }

  @Get('/invoice/getLastTenInvoices/:user')
  getLastTenInvoices(@Param('user') user: string): Promise<Invoice[]> {
    return this.invoiceService.getLastTenInvoices(user);
  }

  @Get('/invoice/getTotalDebt/:user')
  getTotalDebt(@Param('user') user: string): Promise<number> {
    return this.invoiceService.getTotalDebt(user);
  }
  @Get('/invoice/getTotalMonth/:user')
  getTotalMonth(@Param('user') user: string): Promise<number> {
    return this.invoiceService.getTotalMonth(user);
  }

  @Post('/invoice/postNewInvoice/:user')
  postNewInvoice(
    @Param('user') user: string,
    @Body() invoice: Invoice,
  ): Promise<Invoice> {
    return this.invoiceService.postNewInvoice(user, invoice);
  }

  @Post('/invoice/deleteInvoice/:user/:id')
  deleteInvoice(
    @Param('user') user: string,
    @Param('id') id: string,
  ): Promise<Invoice> {
    return this.invoiceService.deleteInvoice(user, id);
  }
}
