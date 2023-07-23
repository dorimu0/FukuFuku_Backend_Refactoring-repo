import { Body, Controller, Post, Get, Param, Delete } from '@nestjs/common';
import { BoardTagsService } from './board-tags.service';
import { BoardTagDto } from './dto/boardTag.dto';
import { Board_Tag } from '@prisma/client';

@Controller('board-tags')
export class BoardTagsController {
  constructor(private boardTagsService: BoardTagsService) {}

  // boardId를 통해 태그 가져오기
  @Get('/:boardId')
  async findTagIdByBoardId(
    @Param('boardId') boardId: number,
  ): Promise<number[]> {
    return await this.boardTagsService.findTagIdByBoardId(boardId);
  }

  @Post()
  async createBoardTags(@Body() boardTagDto: BoardTagDto): Promise<Board_Tag> {
    return await this.boardTagsService.createBoardTags(boardTagDto);
  }

  @Delete('/:boardId')
  async deleteBoardTags(@Param('boardId') boardId: number): Promise<void> {
    return await this.boardTagsService.deleteBoardTags(boardId);
  }
}
