import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentRepository {
  constructor(private prismaService: PrismaService) {}

  // 현재 게시물 댓글 가져오기
  async getCommentsByBoardId(boardId: number): Promise<Comment[]> {
    return this.prismaService.comment.findMany({
      where: { boardId },
    });
  }

  // 댓글 생성
  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { content, boardId, commenter } = createCommentDto;

    const comment = await this.prismaService.comment.create({
      data: {
        content,
        boardId,
        commenter,
      },
    });

    return comment;
  }
}
