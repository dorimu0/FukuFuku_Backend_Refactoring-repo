import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Board } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardRepository {
  constructor(private prismaService: PrismaService) {}

  async getAllBoards(): Promise<Board[]> {
    return this.prismaService.board.findMany();
  }

  async createBoard(createPostDto: CreateBoardDto): Promise<Board> {
    const { title, content } = createPostDto;

    const board = await this.prismaService.board.create({
      data: {
        title,
        content,
      },
    });

    return board;
  }

  async getBoardById(id: number): Promise<Board> {
    return this.prismaService.board.findUnique({
      where: { id },
    });
  }

  async deleteBoard(id: number): Promise<Board> {
    return this.prismaService.board.delete({
      where: { id },
    });
  }

  async getBoardRecent(): Promise<Board> {
    return this.prismaService.board.findFirst({
      orderBy: { id: 'desc' },
    });
  }
}
