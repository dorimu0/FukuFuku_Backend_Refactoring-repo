import { Injectable, NotFoundException, UnprocessableEntityException, UnsupportedMediaTypeException } from '@nestjs/common';
import { Board } from '@prisma/client';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { PostImageRepository } from './boardImage.repository';
import { CreatePostImageDto } from './dto/create-Image.dto';
@Injectable()
export class BoardsService {
  constructor(
    private readonly postRepository: BoardRepository,
    private readonly postImageRepository: PostImageRepository) { }

  // 게시판 가져오기
  async getAllBoards(option: string = undefined): Promise<Board[]> {

    let searchOption: object | [] = [
      { id: 'desc' },
      { like: { _count: 'desc' } },
    ];

    if (option === 'recent') {
      searchOption = {
        id: 'desc',
      }
    }

    else if (option === 'trendy') {
      searchOption = [
        { id: 'desc' },
        { views: 'desc' }
      ]
    }
    
    else if (option) {
      throw new UnprocessableEntityException();
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

  // 게시글 생성
  async createBoard(createPostDto: CreateBoardDto): Promise<Board> {
    const board = await this.postRepository.create(createPostDto);

    return board;
  }


  deleteBoard(id: number): Promise<Board> {
    return this.postRepository.deleteBoard({ id });
  }

  // 한 번에 업데이트 할 수 있음
  updateBoardContent(id: number, content: string): Promise<Board> {
    return this.postRepository.updateBoard({ where: { id }, data: { content } });
  }
  updateBoardTitle(id: number, title: string): Promise<Board> {
    return this.postRepository.updateBoard({ where: { id }, data: { title } });
  }

  // 이미지 업로드 - 게시글 id 로 생성
  async uploadImage(id: CreatePostImageDto, req) {
    // 이미지 파일 보내지 않은 경우
    const fileValidationError = req.fileValidationError;
    if (fileValidationError !== 'format does fit') {
      throw new UnprocessableEntityException();
    }
    // 이미지 파일 형식이 맞지 않은 경우
    else if (fileValidationError === "format doesn't fit") {
      throw new UnsupportedMediaTypeException();
    }
    // url 가져오기
    const url: string = req.files[0].location;

    const image = await this.postImageRepository.createImage({ url, id });

    // return image;
  }
  // 이미지 삭제 - url 로 찾아서 삭제
  async removeImage(url: string) { }

  

  // 좋아요 누른 글 불러오기
  getLikedBoards() { }
}
