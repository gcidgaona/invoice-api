import { Injectable } from '@nestjs/common';
import { ISelect } from './select.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Select as SelectSchema, SelectsDocument } from './select.schema';
import { User as UserSchema, UsersDocument } from '../user/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class SelectService {
  constructor(
    @InjectModel(SelectSchema.name)
    private selectModel: Model<SelectsDocument>,
    @InjectModel(UserSchema.name)
    private userModel: Model<UsersDocument>,
  ) {}

  public async getAll(userEmail: string): Promise<ISelect[]> {
    const getFriends = await this.userModel.findOne({
      userEmail: userEmail,
    });
    const { friends } = getFriends;
    const structure = {
      type: 'friends',
      body: friends,
    };
    const resultSelects = await this.selectModel.find({});
    const test = [...resultSelects, structure];
    return test;
  }
}
