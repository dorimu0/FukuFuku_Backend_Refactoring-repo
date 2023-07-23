import { Module } from '@nestjs/common';
import { BoardTagsController } from './board-tags.controller';
import { BoardTagsService } from './board-tags.service';
import { PrismaService } from 'src/prisma.service';
import { BoardTagRepository } from './board-tag.repository';

@Module({
  controllers: [BoardTagsController],
  providers: [BoardTagsService, PrismaService, BoardTagRepository],
})
export class BoardTagsModule {}
