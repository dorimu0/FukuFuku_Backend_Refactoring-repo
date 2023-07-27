import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { PrismaService } from 'src/prisma.service';
import { LikeRepository } from './like.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [LikeController],
  providers: [LikeService, PrismaService, LikeRepository]
})
export class LikeModule {}
