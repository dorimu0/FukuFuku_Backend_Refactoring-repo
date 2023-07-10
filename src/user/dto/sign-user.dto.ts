import IsNotEmptyString from '../../decorators/is-not-empty-string.decorator';
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from './create-user.dto';

export class SignUserDto extends PartialType(CreateUserDto) {
  @IsNotEmptyString()
  readonly token: string;
}