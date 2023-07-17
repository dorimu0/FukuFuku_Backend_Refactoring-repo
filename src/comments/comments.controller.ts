import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from '@prisma/client';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  // 현재 게시물 댓글 가져오기
  @Get('/:boardId')
  getCommentsByBoardId(@Param('boardId', ParseIntPipe) boardId: number) {
    return this.commentsService.getCommentsByBoardId(boardId);
  }

  @Post()
  createComments(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.createComment(createCommentDto);
  }

  // 댓글 삭제
  @Delete('/:id')
  deleteComment(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentsService.deleteComment(id);
  }
}
