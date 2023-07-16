import { Injectable } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { Reply } from '@prisma/client';
import { ReplyRepository } from './reply.repository';

@Injectable()
export class ReplysService {
  constructor(private replyRepository: ReplyRepository) {}

  // 현재 댓글의 답글 가져오기
  async getReplysByCommentId(commentId: number) {
    return await this.replyRepository.getReplysByCommentId(commentId);
  }

  // 답글 생성
  async createReply(createReplyDto: CreateReplyDto): Promise<Reply> {
    return this.replyRepository.createReply(createReplyDto);
  }
}
