import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BoardTagDto } from './dto/boardTag.dto';
import { Board_Tag } from '@prisma/client';

@Injectable()
export class BoardTagRepository {
  constructor(private prismaService: PrismaService) {}

  // boardId를 통해 태그 ID 만 가져오기
  async findTagIdByBoardId(b_id: number): Promise<number[]> {
    const boardTags = await this.prismaService.board_Tag.findMany({
      where: {
        b_id,
      },
      select: {
        tagId: true,
      },
    });

    return boardTags.map((boardTag) => boardTag.tagId);
  }

  // 태그 생성
  async createBoardTags(boardTagDto: BoardTagDto): Promise<Board_Tag> {
    const { b_id, tagId } = boardTagDto;

    return await this.prismaService.board_Tag.create({
      data: {
        b_id,
        tagId,
      },
    });
  }

  // 게시물 id로 태그 삭제
  async deleteBoardTags(b_id: number): Promise<void> {
    await this.prismaService.board_Tag.deleteMany({
      where: {
        b_id,
      },
    });
  }
}
