import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) { }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereInput,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: userWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: { ...data, nickName: data.email }
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  // 유저 페이지
  async getUserPage(nickName: string) {
    return this.prisma.user.findMany({
      where: {
        nickName: nickName
      },
      select: {
        board: {
          include: { boardImage: true, like: true }
        }
      }
    });
  }

  // 좋아요 누른 글 가져오기
  async getLiked(id: number) {
    return this.prisma.user.findMany({
      where: { id },
      select: {
        like: {
          select: {
            board: true
          }
        }
      }
    })
  }
}
