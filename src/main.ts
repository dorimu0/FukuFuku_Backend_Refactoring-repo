import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'production'
      ? '.production.env'
      : process.env.NODE_ENV === 'stage'
      ? '.stage.env'
      : '.env',
  ),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 데코레이터를 가지지 않는 프로퍼티(dto에 맞지 않는 데이터)에서 유효성 검사된 객체 제거
      forbidNonWhitelisted: true, // whitelist의 객체를 제거하지 않고 Error throw - controller까지 도달하지 않음
      transform: true, // 요청 들어온 데이터를 type에 맞게 변경
    }),
  );
  await app.listen(3000);
}
bootstrap();
