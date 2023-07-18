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
import { NoContent, OK, responseFormat } from 'src/common/util/responseFormat';
import { IsAuthenticable } from 'src/common/decorators/authentic.decorator';
import {
  UpdateUserIntroductionDto,
  UpdateUserNicknameDto,
  UpdateUserPictureDto,
} from './dto/update-user.dto';
import { UserDeleteWhereDto } from './dto/delete-user.dto';
import { S3Interceptor } from 'src/common/util/upload.interceptor';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 닉네임 중복 체크
  // @UseGuards(AccessGuard)
  @Get('check/:nickName')
  async isExistNickname(@Param('nickName') nickname: string) {
    await this.userService.nicknameDuplicateCheck(nickname, 'request');
    return responseFormat(OK);
  }

  // 닉네임 수정
  @IsAuthenticable('author')
  @Put('/editNickname')
  async editNickname(@Body('data') data: UpdateUserNicknameDto) {
    const result = await this.userService.editNickname(data);

    // UX를 위한 데이터 response
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
  async withdraw(@Body('data') userData: UserDeleteWhereDto) {
    await this.userService.withdraw(userData);

    return responseFormat(NoContent);
  }

  // 이미지 수정
  @IsAuthenticable('author')
  @Put('editImage')
  @UseInterceptors(S3Interceptor)
  async editImage(@Req() req, @Headers('data') userData: UpdateUserPictureDto) {
    const result = await this.userService.editPicture(userData, req);

    return responseFormat(OK, result);
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUserById(id);
  }
}
