import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class UserDeleteWhere extends PickType(CreateUserDto, ['email'] as const) {}

export class UserDeleteWhereDto {
  @ValidateNested({ each: true })
  @Type(() => UserDeleteWhere)
  readonly where: UserDeleteWhere
}