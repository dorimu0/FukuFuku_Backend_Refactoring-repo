import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { BoardRepository } from './board.repository';
import { PrismaService } from 'src/prisma.service';
import { PostImageRepository } from './boardImage.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    BoardsService,
    BoardRepository,
    PrismaService,
    PostImageRepository
  ],
  controllers: [BoardsController],
})
export class BoardsModule {}
