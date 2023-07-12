import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { BoardRepository } from './board.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [BoardsService, BoardRepository, PrismaService],
  controllers: [BoardsController],
})
export class BoardsModule {}
