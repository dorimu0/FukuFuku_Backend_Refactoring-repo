import { Body, Controller, Delete, Post, HttpCode } from '@nestjs/common';
import { LikeDto } from './dto/create-like.dto';
import { LikeService } from './like.service';
import { responseFormat, Created, NoContent } from '../common/util/responseFormat';
import { IsAuthenticable } from 'src/common/decorators/authentic.decorator';
import { UserRoleGuard } from 'src/common/guard/role.guard';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // 좋아요 생성
  @HttpCode(201)
  @IsAuthenticable(UserRoleGuard, 'author', 'u_id')
  @Post()
  async like(@Body('data') data: LikeDto) {
    await this.likeService.like(data);
    return responseFormat(Created);
  }
  
  // 좋아요 취소
  @HttpCode(204)
  @IsAuthenticable(UserRoleGuard, 'author', 'u_id')
  @Delete()
  async unlike(@Body('data') data: LikeDto) {
    await this.likeService.unlike(data);
  }
}
