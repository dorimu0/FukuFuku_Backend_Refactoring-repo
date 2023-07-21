import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Board } from '@prisma/client';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { EditBoardDto } from './dto/edit-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private postsService: BoardsService) {}

  // 전체 게시물 가져오기
  @Get()
  getAllBoard(): Promise<Board[]> {
    return this.postsService.getAllBoards();
  }

  // id로 게시물 가져오기
  @Get('/:id')
  getBoardById(@Param('id', ParseIntPipe) id: number): Promise<Board> {
    return this.postsService.getBoardById(id);
  }

  @Get('/recent')
  getRecentBoard(): Promise<Board[]> {
    return this.postsService.getRecentBoard();
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
    @Body() editBoardDto: EditBoardDto,
  ): Promise<Board> {
    return this.postsService.updateBoard(id, editBoardDto);
  }
}
