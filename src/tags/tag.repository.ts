import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TagDto } from './dto/tag.dto';

@Injectable()
export class TagRepository {
  constructor(private prismaService: PrismaService) {}

  // boardId 로 태그 조회

  // 태그 생성
  async createTag(tagDto: TagDto): Promise<Tag[]> {
    const { tag } = tagDto;
    tag.map(async (name) => {
      await this.prismaService.tag.create({
        data: {
          name,
        },
      });
    });
  }
}
