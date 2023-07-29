import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, BoardImage } from '@prisma/client';
import { deleteObject } from 'src/common/util/deleteObjectFromS3';

@Injectable()
export class PostImageRepository {
  constructor(private readonly prismaService: PrismaService) { }

  // 이미지 생성
  async createImage(postimageCreateInput): Promise<BoardImage> {
    const postImage = await this.prismaService.boardImage.create({
      data: {
        url: postimageCreateInput.url,
        board: {
          connect: {
            id: postimageCreateInput.id
          }
        }
      }
    })
    
    return postImage;
  }

  // 이미지 삭제
  async deleteImage(url: string) {
    const deleteImage = await this.prismaService.boardImage.delete({
      where: {
        url: url
      }
    });

    // S3 이미지 삭제
    deleteObject([url]);
  }

  // 이미지 하나 url 가져오기 - 게시글 여러 개 불러올 때 사용
  async getImage(id: number) {
    const image = await this.prismaService.boardImage.findFirst({
      where: {
        b_id: id
      }
    });
    
    return image;
  }

  // 이미지 전체
}