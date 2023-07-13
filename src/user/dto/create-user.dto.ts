import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import IsNotEmptyString from '../../decorators/is-not-empty-string.decorator';

export class CreateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmptyString()
  readonly picture: string;

  @IsNotEmptyString()
  readonly firstName: string;

  @IsNotEmptyString()
  readonly lastName: string;

  @IsNotEmptyString()
  readonly refreshToken?: string;
}
