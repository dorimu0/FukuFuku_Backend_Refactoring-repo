import { Request } from 'express';
import { UserService } from "src/user/user.service";

export class Role {
  constructor(
    protected readonly userService: UserService
  ) { }

  // 요청자와 유저가 같은지 확인
  isAuthor(request: Request, option: string): boolean {
    try {
      const userId = this.getUserInfo(request, option);
      const clientId = request.body.client.id;

      return clientId == userId;
    } catch (error) {
      const isAuthor = this.isAuthorByHeader(request);

      if (isAuthor) {
        return true;
      }
      return false;
    }
  }

  // 관리자 여부 확인
  async isAdmin(request: Request): Promise<boolean> {
    // 요청자의 id
    const id = parseInt(request.body.client.id);

    // 관리자 인지 확인
    const userInfo = await this.userService.findUser({ id });

    if (userInfo.isAdmin !== null) {
      return true;
    }

    return false;
  }

  // jwt 를 디코딩한 결과 값과 body에 있는 값을비교
  getUserInfo(request: Request, option: string) {
    try {
      const { data } = request.body
      // 옵션에 따라 다른 인증 방식
      if (option === 'u_id') {
        return data['u_id']
      }

      return data?.where ? data.where[option] : data[option];
    } catch (error) {
      return request.headers.data;
    }
  }

  // 헤더의 정보로 확인
  isAuthorByHeader(request: Request) {
    const clientInfo = request.body.client.id;
    const userInfo = request.headers.data;
    return clientInfo === userInfo;
  }
}