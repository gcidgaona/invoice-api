import { Controller, Get, Inject, Param } from '@nestjs/common';
import { IConsolid } from './consolid.interface';
import { Invoice as IInvoice } from '../Invoice/invoice.interface';
import { ConsolidService } from './consolid.service';

@Controller('/consolid')
export class ConsolidController {
  @Inject(ConsolidService)
  private readonly consolidService: ConsolidService;

  @Get('/:user/:userTo')
  consolidDebt(
    @Param('user') user: string,
    @Param('userTo') userTo: string,
  ): Promise<IConsolid> {
    return this.consolidService.consolidDebt(user, userTo);
  }
  @Get('/pay/:user/:userTo/:userDebt/:userToDebt')
  payDebt(
    @Param('user') user: string,
    @Param('userTo') userTo: string,
    @Param('userDebt') userDebt: string,
    @Param('userToDebt') userToDebt: string,
  ): Promise<boolean> {
    const parsedDataUserDebt = JSON.parse(userDebt);
    const parsedDataUserToDebt = JSON.parse(userToDebt);
    return this.consolidService.payDebt(
      user,
      userTo,
      parsedDataUserDebt,
      parsedDataUserToDebt,
    );
  }
  @Get('/confirm/:user/:userTo/:userDebt/:userToDebt/:idNot')
  confirmDebt(
    @Param('user') user: string,
    @Param('userTo') userTo: string,
    @Param('userDebt') userDebt: string,
    @Param('userToDebt') userToDebt: string,
    @Param('idNot') idNot: string,
  ): Promise<boolean> {
    const parsedDataUserDebt = JSON.parse(userDebt);
    const parsedDataUserToDebt = JSON.parse(userToDebt);
    return this.consolidService.confirmDebt(
      user,
      userTo,
      parsedDataUserDebt,
      parsedDataUserToDebt,
      idNot,
    );
  }
}
