import { IsOptional } from 'class-validator';
import { IsNotEmptyString } from 'src/common/decorators/is-not-empty-string.decorator';

export class UpdateBoardDto {
  @IsNotEmptyString()
  @IsOptional()
  readonly title: string;
  
  @IsNotEmptyString()
  @IsOptional()
  readonly content: string;
}
