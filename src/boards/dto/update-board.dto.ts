import { PickType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { IsNotEmptyString } from 'src/common/decorators/is-not-empty-string.decorator';
import { IsNotEmptyNumber } from 'src/common/decorators/is-not-empty-number.decorator';
import { CreateBoardDto } from './create-board.dto';

export class UpdateBoardDto extends PickType(CreateBoardDto, [
  'id',
  'images'
] as const) {

  @IsNotEmptyNumber()
  readonly b_id: number;

  @IsNotEmptyString()
  @IsOptional()
  readonly title: string;

  @IsNotEmptyString()
  @IsOptional()
  readonly content: string;
}
