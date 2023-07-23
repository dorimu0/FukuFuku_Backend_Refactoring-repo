import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Board } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board.dto';
import { EditBoardDto } from './dto/edit-board.dto';

@Injectable()
export class BoardRepository {
  constructor(private prismaService: PrismaService) {}

  // 모든 게시물 가져오기
  async getAllBoards(): Promise<Board[]> {
    return this.prismaService.board.findMany();
  }

  async getRecentBoard(): Promise<Board[]> {
    return this.prismaService.board.findMany({
      take: 5,
      orderBy: {
        id: 'desc',
      },
    });
  }

  // 게시물 생성 할때 Dto를 사용하여 데이터를 받아오고 PrismaService를 사용하여 데이터베이스에 저장
  async createBoard(createPostDto: CreateBoardDto): Promise<Board> {
    const { title, content, u_id } = createPostDto;

    const board = await this.prismaService.board.create({
      data: {
        title,
        content,
        u_id,
      },
    });

    return board;
  }

  // id로 게시물 가져오기
  async getBoardById(id: number): Promise<Board> {
    const find = await this.prismaService.board.findUnique({
      where: { id },
      include: {
        comment: true,
        board_tag: {
          include: {
            tag: true,
          },
        },
        user: true,
      },
    });

    if (!find) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }

    return find;
  }

  // 게시물 삭제
  async deleteBoard(id: number): Promise<Board> {
    return this.prismaService.board.delete({
      where: { id },
    });
  }

  // 게시물 수정
  async updateBoard(id: number, editBoardDto: EditBoardDto): Promise<Board> {
    const { title, content } = editBoardDto;

    return this.prismaService.board.update({
      where: { id },
      data: {
        title,
        content,
      },
    });
  }

  // 게시물 검색 태그도 검색
  async searchBoard(keyword: string): Promise<Board[]> {
    return this.prismaService.board.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            content: {
              contains: keyword,
            },
          },
          {
            board_tag: {
              some: {
                tag: {
                  name: {
                    contains: keyword,
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });
  }
}
