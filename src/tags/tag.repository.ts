import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagRepository {
  constructor(private prismaService: PrismaService) {}

  // boardId 로 태그 조회
}
