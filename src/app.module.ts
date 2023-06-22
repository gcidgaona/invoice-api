import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceModule } from './features/Invoice';
import { SelectModule } from './features/select';
import { UsersModule } from './features/user';
import { ConsolidModule } from './features/consolid';

@Module({
  imports: [
    InvoiceModule,
    UsersModule,
    SelectModule,
    ConsolidModule,
    MongooseModule.forRoot(
      'mongodb+srv://gcidgaona:onedream1@cluster0.pg5io1f.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'invoice' },
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
