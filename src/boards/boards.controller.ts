import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Board } from '@prisma/client';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private postsService: BoardsService) {}

  @Get()
  getAllBoard(): Promise<Board[]> {
    return this.postsService.getAllBoards();
  }

  @Get('/:id')
  getBoardById(@Param('id', ParseIntPipe) id: number): Promise<Board> {
    return this.postsService.getBoardById(id);
  }

  @Post()
  createBoard(@Body() createPostDto: CreateBoardDto): Promise<Board> {
    return this.postsService.createBoard(createPostDto);
  }

  @Delete('/:id')
  deleteBoard(@Param('id', ParseIntPipe) id: number): Promise<Board> {
    return this.postsService.deleteBoard(id);
  }
}
