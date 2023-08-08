import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IsNotEmptyNumber } from "src/common/decorators/is-not-empty-number.decorator";

class UserDeleteWhere {
  @IsNotEmptyNumber()
  id: number;
}

export class UserDeleteWhereDto {
  @ValidateNested({ each: true })
  @Type(() => UserDeleteWhere)
  readonly where: UserDeleteWhere
}