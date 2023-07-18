import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentRepository } from './comment.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository, PrismaService],
})
export class CommentsModule {}
