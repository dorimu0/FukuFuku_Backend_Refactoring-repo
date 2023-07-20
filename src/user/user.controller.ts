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
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  UpdateUserIntroductionDto,
  UpdateUserNicknameDto,
} from './dto/update-user.dto';
import { IsAuthenticable } from 'src/common/decorators/authentic.decorator';
import { responseFormat, OK, NoContent } from '../common/util/responseFormat';
import { UserDeleteWhereDto } from './dto/delete-user.dto';
import { fileInterceptor } from '../common/util/upload.interceptor';
import { AccessGuard } from 'src/common/guard/access.guard';
import { UserRoleGuard } from 'src/common/guard/role.guard';
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
  @IsAuthenticable(UserRoleGuard, 'author', 'id')
  @Put('/editNickname')
  async editNickname(@Body('data') data: UpdateUserNicknameDto) {
    const result = await this.userService.editNickname(data);

    return responseFormat(OK, result);
  }

  // 자기 소개 수정
  @IsAuthenticable(UserRoleGuard, 'author', 'id')
  @Patch('/editIntroduction')
  async editIntroduction(@Body('data') updateData: UpdateUserIntroductionDto) {
    const result = await this.userService.editIntroduction(updateData);

    return responseFormat(OK, result);
  }

  // 회원 탈퇴
  @IsAuthenticable(UserRoleGuard, 'author', 'id')
  @Delete('/withdraw')
  @HttpCode(204)
  async withdraw(@Body('data') userData: UserDeleteWhereDto) {
    await this.userService.withdraw(userData);

    return responseFormat(NoContent);
  }

  // 이미지 수정
  @IsAuthenticable(UserRoleGuard, 'author', 'id')
  @Put('/editImage')
  @UseInterceptors(fileInterceptor)
  async editImage(@Req() req, @Headers('data') u_id) {
    const id = parseInt(u_id, 10);

    const result = await this.userService.editPicture(id, req);

    return responseFormat(OK, result);
  }

  // 자신이 쓴 글 검색
}
