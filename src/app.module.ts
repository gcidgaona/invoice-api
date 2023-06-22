import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceModule } from './features/Invoice';
import { SelectModule } from './features/select';
import { UsersModule } from './features/user';
import { ConsolidModule } from './features/consolid';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    InvoiceModule,
    UsersModule,
    SelectModule,
    ConsolidModule,
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
