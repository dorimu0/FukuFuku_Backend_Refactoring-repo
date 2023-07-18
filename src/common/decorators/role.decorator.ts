import { SetMetadata } from "@nestjs/common";

export type AllowedRole = 'admin' | 'author';

export const Role = (roles: AllowedRole[]) => SetMetadata('roles', roles);