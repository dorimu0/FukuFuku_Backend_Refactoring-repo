import { IsNotEmptyString } from 'src/common/decorators/is-not-empty-string.decorator';
import { IsNotEmptyNumber } from 'src/common/decorators/is-not-empty-number.decorator';

export class CreateBoardDto {
  @IsNotEmptyString()
  readonly title: string;

  @IsNotEmptyString()
  readonly content: string;

  @IsNotEmptyNumber()
  readonly id: number; // 유저의 id를 여기에 추가해야합니다.
}