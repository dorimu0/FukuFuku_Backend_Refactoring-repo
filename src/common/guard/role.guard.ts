import { CanActivate, ExecutionContext, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AllowedRole } from "../decorators/role.decorator";
import { UserService } from "src/user/user.service";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.get<AllowedRole[]>(
      // 메타데이터 키
      'roles',
      // 가져오려는 범위 - 핸들러 = 메서드 
      // 즉 메서드에 붙어있는 roles 라는 이름을 가진 메타데이터의 값을 가져온다.
      context.getHandler(),
    )[0];

    if (!requiredRoles) {
      return true;
    }

    // 요청자 본인의 데이터인지 확인
    if (requiredRoles === 'author') {
      const isAuthenticable = this.isAuthor(request);

      if (!isAuthenticable) {
        throw new UnprocessableEntityException();
      }

      return isAuthenticable;
    }
    
    // 관리자 인지 확인
    if (requiredRoles === 'admin') {
      const isAuthenticable = this.isAdmin(request);
      return isAuthenticable;
    }
  }

  // 요청자와 유저가 같은지 확인
  private isAuthor(request: Request): boolean {
    try {
      const clientInfo = this.getClientInfo(request)['email'];
      const userInfo = this.getUserInfo(request)['email'];
      return clientInfo === userInfo;
    } catch (error) {
      const isAuthor = this.isAuthorByHeader(request);
      if (isAuthor) {
        return true;
      }
      return undefined;
    }
  }

  // req 의 헤더에 token 디코딩
  private getClientInfo(request: Request): string | { [key: string]: any } {
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    const decoded = this.jwtService.decode(token);
    return decoded;
  }

  // jwt 를 디코딩한 결과 값과 body에 있는 값을비교
  private getUserInfo(request: Request): object {
    const { data } = request.body

    if (!data) return;

    return data?.where;
  }

  // 관리자 여부 확인
  private async isAdmin(request: Request): Promise<boolean> {
    // 디코딩한 토큰값
    const email = this.getClientInfo(request)['email'];

    // 관리자 인지 확인
    const userInfo = await this.userService.findUser({ email })

    if(userInfo.isAdmin !== null) {
      return true;
    }

    return false;
  }

  // 헤더의 정보로 확인
  private isAuthorByHeader(request: Request) {
    const clientInfo = this.getClientInfo(request)['email'];
    const userInfo = request.headers?.data;

    return clientInfo === userInfo;
  }
}