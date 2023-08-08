import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { LikeDto } from "./dto/create-like.dto";

@Injectable()
export class LikeRepository {
  constructor(private readonly prisma: PrismaService) { }

  // 좋아요 생성
  create(LikeDto: LikeDto) { 
    return this.prisma.like.create({
      data: {
        user: {
          connect: { id: LikeDto.u_id }
        },
        board: {
          connect: { id: LikeDto.b_id }
        },
      }
    });
  }

  // 좋아요 취소
  delete(LikeDto: LikeDto) {
    return this.prisma.like.delete({
      where: { b_id_u_id: LikeDto }
    });
  }
}