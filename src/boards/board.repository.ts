import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Board, Prisma } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board.dto';
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
        postImage: { select: { url: true } },
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

  // 조회수
  async updateViews(id: number) {
    await this.prismaService.board.update({
      where: {
        id
      },
      data: {
        views: {
          increment: 1
        }
      }
    });
  }

  // 유저가 작성한 글 가져오기
  async getUsersBoards(id: number) {
    return this.prismaService.user.findMany({
      where: {
        id: id
      },
      include: {
        board: {
          include: { postImage: true, like: true }
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
  async updateBoard(params: {
    where: Prisma.BoardWhereUniqueInput;
    data: Prisma.BoardUpdateInput;
  }): Promise<Board> {
    return this.prismaService.board.update({
      where: params.where,
      data: params.data,
    });
  }

}