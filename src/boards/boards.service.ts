import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Board } from '@prisma/client';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PostImageRepository } from './boardImage.repository';
import { deleteObject } from '../common/util/deleteObjectFromS3';

@Injectable()
export class BoardsService {
  constructor(
    private readonly postRepository: BoardRepository,
    private readonly postImageRepository: PostImageRepository,
  ) {}

  /** 게시판 가져오기 - 조회 순서 옵션, 날짜 옵션 */
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
    if (createdAt.gte && createdAt.lte) {
      createdAt.gte = new Date(createdAt.gte);
      createdAt.lte = new Date(createdAt.lte);
      searchOption['where'] = { createdAt };
    }
    return this.postRepository.getAllBoards(searchOption);
  }

  /** 특정한 글 하나 가져오기 */
  async getBoardById(b_id: number) {
    const post = await this.postRepository.getBoardById(b_id);
    if (post === null) {
      throw new NotFoundException('No post');
    }

    // 조회수 업데이트
    await this.postRepository.updateViews(b_id);
    return post;
  }

  /** 유저가 쓴 글 전체 불러오기 */
  async getUsersBoards(u_id: number) {
    const usersBoards = await this.postRepository.getUsersBoards(u_id);

    if (!usersBoards.length) throw new NotFoundException();
    return usersBoards;
  }

  /** 게시글 생성, 이미지 연결, 업로드된 이미지가 DB에 없다면 에러 발생 */
  async createBoard(createPostDto: CreateBoardDto): Promise<Board> {
    const isStoredImage = await this.isStoredImage(createPostDto);
    await this.postImageRepository.deleteTempImage(createPostDto.images);

    // 저장된 이미지와 등록하려는 이미지가 다른 경우
    if (!isStoredImage) {
      throw new BadRequestException('등록할 수 없는 이미지가 포함 되어 있습니다.')
    }

    const board = await this.postRepository.create(createPostDto);

    if (createPostDto?.images) {
      this.connectImagesAndBoard(board.id, createPostDto);
    }
    return board;
  }

  /** S3 객체 삭제 후 게시글 삭제 */
  async deleteBoard(id: number) {
    try {
      const images = await this.postImageRepository.getImages(id);

      const s3ObjectKeys = images.map((image) => image.key);

      deleteObject(s3ObjectKeys);

      // 게시글 삭제
      await this.postRepository.deleteBoard({ id });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  /** 게시글 수정 - 이미지, 제목, 내용 */
  updateBoard(updateBoardDto: UpdateBoardDto): Promise<Board> {
    if (updateBoardDto?.images) {
      this.connectImagesAndBoard(updateBoardDto.b_id, updateBoardDto);
    }
    return this.postRepository.updateBoard(updateBoardDto);
  }

  /** 게시글 검색 */
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

  /** 이미지와 게시글 연결 */
  async connectImagesAndBoard(b_id: number, createPostDto: CreateBoardDto) {
    const connectData = createPostDto.images.map((image) => {
      return { b_id, url: image.url, key: image.key };
    });

    // 이미지 연결
    this.postImageRepository.connect(connectData);
  }

  /** 이미지 저장 여부 확인 */
  async isStoredImage(createPostDto: CreateBoardDto) {
    const isEnclude = createPostDto.images?.length;
    if (!isEnclude) {
      return true;
    }

    const storedImages = await this.postImageRepository.getTempImage(createPostDto.images);
    
    return storedImages?.length === createPostDto.images?.length;
  }
}
