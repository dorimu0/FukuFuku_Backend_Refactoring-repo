import { SetMetadata } from "@nestjs/common";

export type AllowedRole = 'admin' | 'author';

export type AllowedOption = 'id' | 'u_id';

export const Role = (roles: AllowedRole[]) => SetMetadata('roles', roles);

export const RoleOption = (option: AllowedOption[]) => SetMetadata('option', option);