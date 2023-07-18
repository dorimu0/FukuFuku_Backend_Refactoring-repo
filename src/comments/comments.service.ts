import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private commentRepository: CommentRepository) {}

  // 현재 게시물 댓글 가져오기
  async getCommentsByBoardId(boardId: number) {
    return await this.commentRepository.getCommentsByBoardId(boardId);
  }

  // 댓글 생성
  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentRepository.createComment(createCommentDto);
  }

  // 댓글 삭제
  async deleteComment(id: number): Promise<Comment> {
    return this.commentRepository.deleteComment(id);
  }
}
