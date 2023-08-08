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

  // 태그 이름으로 태그 가져오기
  async findTagByName(tagName: string): Promise<Tag> {
    return await this.tagRepository.findTagByName(tagName);
  }

  // 태그 생성
  async createTags(tagDto: TagDto): Promise<Tag> {
    return await this.tagRepository.createTags(tagDto);
  }

  // 태그 id를 가지고 있는 게시물 가져오기
  async findBoardByTagId(tagId: number): Promise<Tag> {
    return await this.tagRepository.findBoardByTagId(tagId);
  }
}
