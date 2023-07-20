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

    // 만약 태그가 존재한다면 해당 태그를 반환
    const tag = await this.prismaService.tag.findUnique({
      where: {
        name,
      },
    });

    if (tag) {
      return tag;
    }

    return await this.prismaService.tag.create({
      data: {
        name,
      },
    });
  }

  // 태그 id를 가지고 있는 게시물 가져오기
  async findBoardByTagId(tagId: number): Promise<Tag> {
    return await this.prismaService.tag.findUnique({
      where: {
        id: tagId,
      },
      include: {
        board_tag: {
          include: {
            board: true,
          },
        },
      },
    });
  }
}
