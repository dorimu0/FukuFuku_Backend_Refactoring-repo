import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
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

    // 요청자, 수정하려는 데이터의 실존 여부
    const id = super.getUserInfo(request, requiredOption);
    const isUser = await this.userService.findUser({ id: parseInt(id) });

    if (!id || !isUser) {
      throw new UnauthorizedException();
    }

    // 요구되는 롤에 대한 요청자의 부합 여부
    const isAuthenticable = (requiredRoles === 'author')
      ? super.isAuthor(request, requiredOption)
      : await super.isAdmin(request);    

    if (!isAuthenticable) {
      throw new ForbiddenException();
    }

    return true;
  }
}