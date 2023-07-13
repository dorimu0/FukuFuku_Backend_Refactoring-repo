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
    const found = await this.postRepository.getBoardById(id);

    if (!found) {
      throw new Error(`Can't find board with id ${id}`);
    }

    return found;
  }

  createBoard(createPostDto: CreateBoardDto, authorization): Promise<Board> {
    return this.postRepository.createBoard(createPostDto, authorization);
  }

  deleteBoard(id: number): Promise<Board> {
    return this.postRepository.deleteBoard(id);
  }
}
