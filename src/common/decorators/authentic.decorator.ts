import { CanActivate, Type, applyDecorators } from '@nestjs/common';
import { Role, AllowedRole, RoleOption, AllowedOption } from './role.decorator';
import { UseGuards } from '@nestjs/common';
import { AccessGuard } from '../guard/access.guard';

// 사용자 권한 확인
export function IsAuthenticable(
  guard: Type<CanActivate>,
  role: AllowedRole,
  option: AllowedOption,
) {
  return applyDecorators(
    // access 토큰, 요청자와 role
    Role([role]),
    RoleOption([option]),
    UseGuards(AccessGuard, guard),
  );
}
