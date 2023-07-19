import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagsService {
  constructor(private tagRepository: TagRepository) {}
}
