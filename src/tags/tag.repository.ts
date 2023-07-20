import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TagDto } from './dto/tag.dto';
import { Tag } from '@prisma/client';

@Injectable()
export class TagRepository {
  constructor(private prismaService: PrismaService) {}

  // tagId를 통해 태그 가져오기
  async findTagById(tagId: number): Promise<Tag> {
    return await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
    });
  }

  // 태그 생성
  async createTags(tagDto: TagDto): Promise<Tag> {
    const { name } = tagDto;

    // this.prismaService.tag.findUnique({
    //   where: {
    //     name,
    //   },
    // });

    return await this.prismaService.tag.create({
      data: {
        name,
      },
    });
  }
}
