import { Injectable } from '@nestjs/common';
import { BoardTagRepository } from './board-tag.repository';
import { BoardTagDto } from './dto/boardTag.dto';
import { Board_Tag } from '@prisma/client';

@Injectable()
export class BoardTagsService {
  constructor(private boardTagRepository: BoardTagRepository) {}

  // boardId를 통해 태그 가져오기
  async findTagIdByBoardId(boardId: number): Promise<number[]> {
    return await this.boardTagRepository.findTagIdByBoardId(boardId);
  }

  // 태그 생성
  async createBoardTags(boardTagDto: BoardTagDto): Promise<Board_Tag> {
    return await this.boardTagRepository.createBoardTags(boardTagDto);
  }

  // 게시물 id로 태그 삭제
  async deleteBoardTags(boardId: number): Promise<void> {
    return await this.boardTagRepository.deleteBoardTags(boardId);
  }
}
