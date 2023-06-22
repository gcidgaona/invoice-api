import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { IUser, INotification } from './user.interface';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Get('/checkUser/:email')
  checkUser(@Param('email') email: string): Promise<IUser> {
    return this.userService.checkUser(email);
  }
  @Get('/newUser/:email/:user')
  newUser(
    @Param('email') email: string,
    @Param('user') user: string,
  ): Promise<IUser> {
    return this.userService.newUser(email, user);
  }
  @Get('/firstLoginUser/:email/:user')
  firstLoginUser(
    @Param('email') email: string,
    @Param('user') user: string,
  ): Promise<IUser> {
    return this.userService.firstLoginUser(email, user);
  }
  @Get('/notifications/:email')
  getNotifications(@Param('email') email: string): Promise<INotification[]> {
    return this.userService.getNotifications(email);
  }
}
