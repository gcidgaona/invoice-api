import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser, INotification } from './user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserSchema, UsersDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserSchema.name)
    private userModel: Model<UsersDocument>,
  ) {}

  public async checkUser(email: string): Promise<IUser> {
    if (email === '') return null;
    return await this.userModel.findOne({ userEmail: email });
  }

  public async newUser(email: string, user: string): Promise<IUser> {
    if (user === '') return null;
    const test: IUser = {
      userEmail: email,
      name: user,
    };
    const newUserDb = new this.userModel(test);
    return newUserDb.save();
  }
  public async firstLoginUser(email: string, user: string): Promise<IUser> {
    if (user === '') return null;
    const checkingUser = await this.checkUser(email);
    if (!checkingUser) {
      const response = await this.newUser(email, user);
      return response;
    }
    return;
  }

  public async getNotifications(email: string): Promise<INotification[]> {
    const checkingUser = await this.checkUser(email);
    if (!checkingUser) throw new NotFoundException(`User #${email} not found`);
    return checkingUser.notifications;
  }
}
