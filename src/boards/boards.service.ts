import { Injectable } from '@nestjs/common';
import { Board } from '@prisma/client';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  constructor(private postRepository: BoardRepository) {}

  async getAllBoards(): Promise<Board[]> {
    return this.postRepository.getAllBoards();
  }

  async getBoardById(id: number): Promise<Board> {
    return this.postRepository.getBoardById(id);
  }

  async getRecentBoard(): Promise<Board[]> {
    return this.postRepository.getRecentBoard();
  }

  createBoard(createPostDto: CreateBoardDto): Promise<Board> {
    return this.postRepository.createBoard(createPostDto);
  }

  deleteBoard(id: number): Promise<Board> {
    return this.postRepository.deleteBoard(id);
  }
}
