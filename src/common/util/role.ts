import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

export class Role {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly userService: UserService
  ) { }

  // jwt 를 디코딩한 결과 값과 body에 있는 값을비교
  getUserInfo(request: Request, option: string) {
    const { data } = request.body

    // 옵션에 따라 다른 인증 방식
    if (option === 'email') {
      return data.where[option];
    }

    if (option === 'id') {
      // 보드 아이디로 조회한 데이터의 u_id 값과 보낸 access 토큰의 페이로드에 포함된 id 값을 대조
      return data.where[option];
    }
  }

  // 요청자와 유저가 같은지 확인
  isAuthor(request: Request, option: string): boolean {
    try {
      const clientInfo = this.getClientInfo(request)[option];
      const userInfo = this.getUserInfo(request, option);

      return clientInfo == userInfo;
    } catch (error) {
      const isAuthor = this.isAuthorByHeader(request, option);

      if (isAuthor) {
        return true;
      }
      return false;
    }
  }

  // req 의 헤더에 token 디코딩
  getClientInfo(request: Request): string | { [key: string]: any } {
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    const decoded = this.jwtService.decode(token);
    return decoded;
  }

  // 관리자 여부 확인
  async isAdmin(request: Request, option: string): Promise<boolean> {
    // 디코딩한 토큰값
    const decodedToken = this.getClientInfo(request)[option];

    // 관리자 인지 확인
    const findUserInput = (option === 'id') ? { id: decodedToken.id } : { email: decodedToken.email };
    
    const userInfo = await this.userService.findUser(findUserInput);

    if (userInfo.isAdmin !== null) {
      return true;
    }

    return false;
  }

  // 헤더의 정보로 확인
  isAuthorByHeader(request: Request, option: string) {
    const clientInfo = this.getClientInfo(request)[option];
    const userInfo = request.headers.data;
    return clientInfo === userInfo;
  }
}