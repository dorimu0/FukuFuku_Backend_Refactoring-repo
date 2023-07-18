import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  Req,
  UseInterceptors,
  Headers,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  UpdateUserIntroductionDto,
  UpdateUserNicknameDto,
  UpdateCommonWhere as UpdateUserDto,
} from './dto/update-user.dto';
import { IsAuthenticable } from 'src/common/decorators/authentic.decorator';
import { responseFormat, OK, NoContent } from '../common/util/responseFormat';
import { UserDeleteWhereDto } from './dto/delete-user.dto';
import { fileInterceptor } from '../common/util/upload.interceptor';
import { AccessGuard } from 'src/common/guard/access.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 닉네임 중복 체크
  @UseGuards(AccessGuard)
  @Get('/check/:nickName')
  async isExistNickname(@Param('nickName') nickname: string) {
    await this.userService.nicknameDuplicateCheck(nickname, 'request');
    return responseFormat(OK);
  }

  // 닉네임 수정
  @IsAuthenticable('author')
  @Put('/editNickname')
  async editNickname(@Body('data') data: UpdateUserNicknameDto) {
    const result = await this.userService.editNickname(data);

    return responseFormat(OK, result);
  }

  // 자기 소개 수정
  @IsAuthenticable('author')
  @Patch('/editIntroduction')
  async editIntroduction(@Body('data') updateData: UpdateUserIntroductionDto) {
    const result = await this.userService.editIntroduction(updateData);

    return responseFormat(OK, result);
  }

  // 회원 탈퇴
  @IsAuthenticable('author')
  @Delete('/withdraw')
  @HttpCode(204)
  async withdraw(@Body('data') userData: UserDeleteWhereDto) {
    await this.userService.withdraw(userData);

    return responseFormat(NoContent);
  }

  // 이미지 수정
  @IsAuthenticable('author')
  @Put('/editImage')
  @UseInterceptors(fileInterceptor)
  async editImage(@Req() req, @Headers('data') userData: UpdateUserDto) {
    const result = await this.userService.editPicture(userData, req);

    return responseFormat(OK, result);
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUserById(id);
  }
}
