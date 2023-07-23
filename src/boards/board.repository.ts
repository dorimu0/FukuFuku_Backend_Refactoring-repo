import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Board, Prisma } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board.dto';
import { EditBoardDto } from './dto/edit-board.dto';
const TAKE = 10;
@Injectable()
export class BoardRepository {
  constructor(private readonly prismaService: PrismaService) { }

  // 게시판 가져오기 - 기본적으로는 좋아요가 많은 순으로 가져오기 -OK
  async getAllBoards(searchOption: object | [] = undefined): Promise<Board[]> {

    return this.prismaService.board.findMany({
      take: TAKE,
      orderBy: searchOption,
      include: {
        boardImage: { select: { url: true } },
        user: { select: { id: true, nickName: true } },
        like: true
      }
    });
  }

  // 특정한 글 하나 가져오기
  async getBoardById(
    userWhereUniqueInput: number,
  ) {
    const board = await this.prismaService.board.findFirst({
      where: {
        id: userWhereUniqueInput
      },
      include: {
        like: { select: { u_id: true } },
        comment: { include: { user: true, reply: true } },
        user: { select: { picture: true, nickName: true } },
      },
    });

    return board;
  }

  // 유저가 작성한 글 가져오기
  async getUsersBoards(id: number) {
    return this.prismaService.user.findMany({
      where: {
        id: id
      },
      include: {
        board: {
          include: { boardImage: true, like: true }
        }
      }
    });
  }

  // 게시글 생성
  async create(createPostDto: CreateBoardDto) {
    const board = await this.prismaService.board.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        user: {
          connect: { id: createPostDto.id }
        }
      }
    });

    return board;
  }

  // 게시물 삭제
  async deleteBoard(where: Prisma.BoardWhereUniqueInput): Promise<Board> {
    return this.prismaService.board.delete({
      where
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
            title: { contains: keyword, },
          },
          {
            content: { contains: keyword, },
          },
          {
            board_tag: {
              some: {
                tag: { name: { contains: keyword, }, },
              },
            },
          },
        ],
      },
      include: { user: true, },
    });
  }

  async updateViews(id: number) {
    await this.prismaService.board.update({
      where: {
        id: id
      },
      data: {
        views: {
          increment: 1
        }
      }
    })
  }
}