import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Board } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardRepository {
  constructor(private prismaService: PrismaService) {}

  // 모든 게시물 가져오기
  async getAllBoards(): Promise<Board[]> {
    return this.prismaService.board.findMany();
  }

  // 게시물 생성 할때 Dto를 사용하여 데이터를 받아오고 PrismaService를 사용하여 데이터베이스에 저장
  async createBoard(
    createPostDto: CreateBoardDto,
    authorization,
  ): Promise<Board> {
    const { title, content } = createPostDto;

    const { id } = await this.prismaService.user.findUnique({
      where: { email: authorization },
    });

    const board = await this.prismaService.board.create({
      data: {
        title,
        content,
        user: {
          connect: { id: id },
        },
      },
    });

    return board;
  }

  // id로 게시물 가져오기
  async getBoardById(id: number): Promise<Board> {
    return this.prismaService.board.findUnique({
      where: { id },
    });
  }

  // 게시물 삭제
  async deleteBoard(id: number): Promise<Board> {
    return this.prismaService.board.delete({
      where: { id },
    });
  }
}
