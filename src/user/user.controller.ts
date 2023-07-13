import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // async signIn(@Body() createUserDto: CreateUserDto) {
  //   const userInfo = await this.userService.signIn(createUserDto);
  //   return userInfo;
  // }
}
