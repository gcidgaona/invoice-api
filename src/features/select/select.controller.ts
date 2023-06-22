import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ISelect } from './select.interface';
import { SelectService } from './select.service';

@Controller('/select')
export class SelectController {
  @Inject(SelectService)
  private readonly selectService: SelectService;

  @Get('/getAll/:email')
  getAll(@Param('email') email: string): Promise<ISelect[]> {
    return this.selectService.getAll(email);
  }
}
