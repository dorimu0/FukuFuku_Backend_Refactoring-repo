import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { TagDto } from './dto/tag.dto';
import { Tag } from '@prisma/client';

@Injectable()
export class TagsService {
  constructor(private tagRepository: TagRepository) {}

  // tagId를 통해 태그 가져오기
  async findTagById(tagId: number): Promise<Tag> {
    return await this.tagRepository.findTagById(tagId);
  }

  // 태그 생성
  async createTags(tagDto: TagDto): Promise<Tag> {
    return await this.tagRepository.createTags(tagDto);
  }
}
