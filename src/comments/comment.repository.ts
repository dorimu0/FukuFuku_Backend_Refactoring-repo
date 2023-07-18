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
    const { content, boardId, commenter, img, u_id } = createCommentDto;

    const comment = await this.prismaService.comment.create({
      data: {
        content,
        boardId,
        commenter,
        img,
        u_id,
      },
    });

    return comment;
  }

  // 댓글 삭제
  async deleteComment(id: number): Promise<Comment> {
    return this.prismaService.comment.delete({
      where: { id },
    });
  }

  // 댓글 수정
  async updateComment(id: number, content: string): Promise<Comment> {
    return this.prismaService.comment.update({
      where: { id },
      data: { content },
    });
  }
}
