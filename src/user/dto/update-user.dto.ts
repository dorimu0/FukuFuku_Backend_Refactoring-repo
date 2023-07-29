import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { IsNotEmptyString } from 'src/common/decorators/is-not-empty-string.decorator';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmptyNumber } from 'src/common/decorators/is-not-empty-number.decorator';

class UserUpdateWhere {
  @IsNotEmptyNumber()
  id: number;
}

class UserUpdatePicture extends PickType(CreateUserDto, [,
  'picture',
] as const){
}

class UserUpdateNickName {
  @IsNotEmptyString()
  readonly nickName: string;
}

class UserUpdateIntroduction {
  @IsNotEmptyString()
  readonly introduction: string;
}

export class UpdateCommonWhere {
  @ValidateNested({ each: true })
  @Type(() => UserUpdateWhere)
  readonly where: UserUpdateWhere;
}

export class UpdateUserPictureDto extends IntersectionType(UpdateCommonWhere) {
  @ValidateNested({ each: true })
  @Type(() => UserUpdatePicture)
  readonly data: UserUpdatePicture;
}

export class UpdateUserNicknameDto extends IntersectionType(UpdateCommonWhere) {
  @ValidateNested({ each: true })
  @Type(() => UserUpdateNickName)
  readonly data: UserUpdateNickName;
}

export class UpdateUserIntroductionDto extends IntersectionType(
  UpdateCommonWhere,
) {
  @ValidateNested({ each: true })
  @Type(() => UserUpdateIntroduction)
  readonly data: UserUpdateIntroduction;
}
