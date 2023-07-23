import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Board } from '@prisma/client';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private postsService: BoardsService) { }

  // 게시판 가져오기
  @Get()
  getAllBoard(@Query('option') option: string): Promise<Board[]> {
    return this.postsService.getAllBoards(option);
  }

  // 특정한 글 하나 가져오기
  @Get('/:id')
  async getBoard(@Param('id', ParseIntPipe) id: number) {
    const test = this.postsService.getBoardById(id);
    return test;
  }

  // 특정 사용자가 작성한 게시글 가져오기
  @Get('/author/:id')
  getUsersBoard(@Param('id') id: number) {
    return this.postsService.getUsersBoards(id);
  }

  // 게시물 생성
  // @UseGuards(AccessGuard)
  @Post()
  createBoard(
    @Body() createPostDto: CreateBoardDto,
    // @Request() req,
  ): Promise<Board> {
    return this.postsService.createBoard(createPostDto);
  }

  // 게시물 삭제
  @Delete('/:id')
  deleteBoard(@Param('id', ParseIntPipe) id: number): Promise<Board> {
    return this.postsService.deleteBoard(id);
  }

  // 글 내용 수정
  @Patch('/:id')
  updateBoard(
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
  ): Promise<Board> {
    return this.postsService.updateBoardContent(id, content);
  }
}
