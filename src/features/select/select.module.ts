import { Module } from '@nestjs/common';
import { SelectController } from './select.controller';
import { SelectService } from './select.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Select, SelectSchema } from './select.schema';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Select.name, schema: SelectSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [SelectController],
  providers: [SelectService],
})
export class SelectModule {}
