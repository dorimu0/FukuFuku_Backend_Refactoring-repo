import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Board } from '@prisma/client';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PostImageRepository } from './boardImage.repository';

@Injectable()
export class BoardsService {
  constructor(
    private readonly postRepository: BoardRepository,
    private readonly postImageRepository: PostImageRepository,
  ) {}

  // 게시판 가져오기 - 조회 순서 옵션, 날짜 옵션
  async getAllBoards(
    option: 'recent' | 'trendy' = undefined,
    createdAt: {
      gte: string | Date,
      lte: string | Date,
    } = undefined
  ): Promise<Board[]> {

    let searchOption: object = {
      orderBy: [
        { id: 'desc' },
        { like: { _count: 'desc' }, }
      ]
    };

    if (option === 'recent') {
      searchOption['orderBy'] = [
        { id: 'desc' }
      ]
    }

    else {
      searchOption['orderBy'] = [
        { id: 'desc' },
        { views: 'desc' }
      ]
    }

    // 값이 두 개 다 들어온 경우에만 적용
    if (createdAt) {
      createdAt.gte = new Date(createdAt.gte);
      createdAt.lte = new Date(createdAt.lte);
      searchOption['where'] = { createdAt };
    }

    return this.postRepository.getAllBoards(searchOption);
  }

  // 특정한 글 하나 가져오기 - 조회수 업데이트
  async getBoardById(p_id: number) {
    const post = await this.postRepository.getBoardById(p_id);
    if (post === null) {
      throw new NotFoundException('No post');
    }
    await this.postRepository.updateViews(p_id);
    return post;
  }

  // 유저가 쓴 글 전체 불러오기
  async getUsersBoards(u_id: number) {
    const usersBoards = await this.postRepository.getUsersBoards(u_id);

    if (!usersBoards.length) throw new NotFoundException();
    return usersBoards;
  }

  // 게시글 생성 - 추가적으로 boardImage 테이블의 값들과 연결해야함
  async createBoard(createPostDto: CreateBoardDto): Promise<Board> {
    return this.postRepository.create(createPostDto);
  }

  // 게시글 삭제 - 추가적으로 s3 도 삭제 해야함
  async deleteBoard(id: number) {
    try {
      await this.postRepository.deleteBoard({ id });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  updateBoard(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    return this.postRepository.updateBoard(id, updateBoardDto);
  }

  // 게시글 검색
  async searchBoard(keyword: string, nickName: string = undefined): Promise<Board[]> {
    const searchOption = {
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
    }

    if (nickName) {
      const AND = [{ user: { nickName } }];
      searchOption['AND'] = AND;
    }

    return this.postRepository.searchBoard(searchOption);
  }

  // 이미지 삭제 - url 로 찾아서 삭제
  // async removeImage(url: string) { }
}
