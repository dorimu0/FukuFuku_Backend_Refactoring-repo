import { IsNotEmptyString } from '../../common/decorators/is-not-empty-string.decorator';
import { IsNotEmptyEmail } from 'src/common/decorators/is-not-empty-email.decorator';
export class CreateUserDto {
  @IsNotEmptyEmail()
  readonly email: string;

  @IsNotEmptyString()
  readonly picture: string;

  @IsNotEmptyString()
  readonly firstName: string;

  @IsNotEmptyString()
  readonly lastName: string;
}
