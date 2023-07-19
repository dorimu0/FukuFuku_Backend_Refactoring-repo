import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from '@prisma/client';
import { TagDto } from './dto/tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Post()
  async createTag(@Body() tagDto: TagDto): Promise<Tag[]> {
    return await this.tagsService.createTag(tagDto);
  }
}
