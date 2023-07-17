import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // async signIn(@Body() createUserDto: CreateUserDto) {
  //   const userInfo = await this.userService.signIn(createUserDto);
  //   return userInfo;
  // }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUserById(id);
  }
}
