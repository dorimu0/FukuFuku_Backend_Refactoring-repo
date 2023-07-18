import { Injectable } from '@nestjs/common';
import { Reply } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class ReplyRepository {
  constructor(private prismaService: PrismaService) {}

  // 현재 댓글의 답글 가져오기
  async getReplysByCommentId(commentId: number): Promise<Reply[]> {
    return await this.prismaService.reply.findMany({
      where: {
        c_id: commentId,
      },
    });
  }

  // 답글 생성
  async createReply(createReplyDto: CreateReplyDto): Promise<Reply> {
    const { content, c_id, commenter, img, u_id } = createReplyDto;

    const reply = await this.prismaService.reply.create({
      data: {
        content,
        c_id,
        commenter,
        img,
        u_id,
      },
    });

    return reply;
  }

  // 답글 삭제
  async deleteReply(id: number): Promise<Reply> {
    return this.prismaService.reply.delete({
      where: { id },
    });
  }

  // 답글 수정
  async updateReply(id: number, content: string): Promise<Reply> {
    return this.prismaService.reply.update({
      where: { id },
      data: { content },
    });
  }
}
