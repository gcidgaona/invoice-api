import { Module } from '@nestjs/common';
import { ConsolidController } from './consolid.controller';
import { ConsolidService } from './consolid.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '../Invoice/invoice.schema';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ConsolidController],
  providers: [ConsolidService],
})
export class ConsolidModule {}
