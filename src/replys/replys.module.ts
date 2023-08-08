import { Module } from '@nestjs/common';
import { ReplysController } from './replys.controller';
import { ReplysService } from './replys.service';
import { ReplyRepository } from './reply.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ReplysController],
  providers: [ReplysService, ReplyRepository, PrismaService],
})
export class ReplysModule {}
