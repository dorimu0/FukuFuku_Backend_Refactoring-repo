import { applyDecorators } from '@nestjs/common';
import { RoleGuard } from '../guard/role.guard';
import { Role, AllowedRole } from './role.decorator';
import { UseGuards } from '@nestjs/common';
import { AccessGuard } from '../guard/access.guard';

// 사용자 권한 확인
export function IsAuthenticable(role: AllowedRole) {
  return applyDecorators(
    // access 토큰 확인
    UseGuards(AccessGuard),
    Role([role]),
    // 요청자와 role 확인
    UseGuards(RoleGuard)
  );
}
