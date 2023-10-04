import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Board, Prisma } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /** 게시판 가져오기 */
  async getAllBoards(searchOption: object | [] = undefined, page: number): Promise<Board[]> {
    const TAKE_NUM = 10;
    const skip = TAKE_NUM * page;
    const take = TAKE_NUM * (page + 1);

    return this.prismaService.board.findMany({
      skip,
      take,
      where: searchOption['where'],
      orderBy: searchOption['orderBy'],
      include: {
        boardImage: { select: { url: true } },
        user: { select: { id: true, nickName: true, picture: true } },
        like: true,
        board_tag: { select: { tag: true } },
      },
    });
  }

  /** 특정한 글 하나 가져오기 */
  async getBoardById(
    userWhereUniqueInput: number,
  ) {
    return this.prismaService.board.findFirst({
      where: {
        id: userWhereUniqueInput,
      },
      include: {
        like: { select: { u_id: true } },
        comment: { include: { user: true, reply: true } },
        user: { select: { picture: true, nickName: true, introduction: true } },
        board_tag: { select: { tag: true } },
        boardImage: { select: { url: true } }
      },
    });
  }

  /** 유저가 작성한 글 가져오기 */
  async getUsersBoards(id: number) {
    return this.prismaService.user.findMany({
      where: {
        id: id,
      },
      include: {
        board: {
          include: {
            boardImage: true,
            like: true,
            board_tag: { select: { tag: true } },
          },
        },
      },
    });
  }

  /** 게시글 생성 */
  async create(createPostDto: CreateBoardDto) {
    const board = await this.prismaService.board.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        user: {
          connect: { id: createPostDto.id },
        },
      },
    });

    return board;
  }

  /** 게시글 삭제 */
  async deleteBoard(where: Prisma.BoardWhereUniqueInput): Promise<Board> {
    return this.prismaService.board.delete({
      where,
    });
  }

  /** 게시글 수정 */
  async updateBoard(editBoardDto: UpdateBoardDto): Promise<Board> {
    const { title, content, b_id } = editBoardDto;

    return this.prismaService.board.update({
      where: { id: b_id },
      data: {
        title,
        content,
      },
    });
  }

  /** 게시글 검색 태그도 검색 */
  async searchBoard(where: Prisma.BoardWhereInput): Promise<Board[]> {
    return this.prismaService.board.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            picture: true,
            nickName: true,
          },
        },
        board_tag: {
          select: { tag: true },
        },
      },
    });
  }

  /** 조회 수 올리기 */
  async updateViews(id: number) {
    await this.prismaService.board.update({
      where: {
        id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }
}
