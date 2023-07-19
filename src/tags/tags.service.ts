import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { Tag } from '@prisma/client';
import { TagDto } from './dto/tag.dto';

@Injectable()
export class TagsService {
  constructor(private tagRepository: TagRepository) {}

  async createTag(tagDto: TagDto): Promise<Tag[]> {
    return await this.tagRepository.createTag(tagDto);
  }
}
