import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BoardsModule } from './boards/boards.module';
import { CommentsModule } from './comments/comments.module';
import { ReplysModule } from './replys/replys.module';
import { TagsModule } from './tags/tags.module';
import { BoardTagsModule } from './board-tags/board-tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BoardsModule,
    CommentsModule,
    ReplysModule,
    TagsModule,
    BoardTagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
