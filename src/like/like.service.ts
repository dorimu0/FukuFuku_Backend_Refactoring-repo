import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { LikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(private readonly LikeRepository: LikeRepository) { }

// 좋아요 생성
async like(data: LikeDto) {
  try {
    await this.LikeRepository.create(data);
  } catch (error) {
    if (error.code === 'P2002') {
      throw new ConflictException();
    }
    throw new NotFoundException();
  }
}

// 좋아요 취소
async unlike(data: LikeDto) {
  try {
    await this.LikeRepository.delete(data);
  } catch (error) {
    throw new NotFoundException();
  }
}
}
