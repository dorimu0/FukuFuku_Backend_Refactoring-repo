import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { PrismaService } from 'src/prisma.service';
import { TagRepository } from './tag.repository';

@Module({
  controllers: [TagsController],
  providers: [TagsService, PrismaService, TagRepository],
})
export class TagsModule {}
