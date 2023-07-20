import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { AllowedOption, AllowedRole } from "../decorators/role.decorator";
import { UserService } from "src/user/user.service";
import { Role } from "../util/role";

@Injectable()
export class UserRoleGuard extends Role implements CanActivate {
  constructor(
    readonly jwtService: JwtService,
    readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {
    super(jwtService, userService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.get<AllowedRole[]>(
      'roles',
      context.getHandler(),
    )[0];

    const requiredOption = this.reflector.get<AllowedOption[]>(
      'option',
      context.getHandler(),
    )[0];

    if (!requiredRoles) {
      return true;
    }

    // 요청자가 실존하는지 확인
    const id = super.getUserInfo(request, requiredOption);

    if (!id) {
      throw new UnprocessableEntityException();
    }

    const isUser = await this.userService.findUser({ id: parseInt(id) });

    if (!isUser) {
      throw new NotFoundException();
    }

    // 요청자 본인의 데이터인지 확인
    if (requiredRoles === 'author') {
      const isAuthenticable = super.isAuthor(request, requiredOption);
      // console.log(isAuthenticable)
      if (!isAuthenticable) {
        throw new UnauthorizedException();
      }

      return isAuthenticable;
    }

    // 관리자 인지 확인
    if (requiredRoles === 'admin') {
      const isAuthenticable = await super.isAdmin(request, requiredOption);
      return isAuthenticable;
    }
  }
}