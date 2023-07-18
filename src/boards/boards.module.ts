import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { BoardRepository } from './board.repository';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { GOauthService } from 'src/auth/g-oauth/g-oauth.service';
import { UserRepository } from 'src/user/user.repository';

@Module({
  providers: [
    BoardsService,
    BoardRepository,
    PrismaService,
    AuthService,
    UserService,
    UserRepository,
    GOauthService,
  ],
  controllers: [BoardsController],
})
export class BoardsModule {}
