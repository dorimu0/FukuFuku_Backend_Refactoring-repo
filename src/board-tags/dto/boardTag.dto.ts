import { IsNotEmpty, IsNumber } from 'class-validator';

export class BoardTagDto {
  @IsNumber()
  @IsNotEmpty()
  b_id: number;

  @IsNumber()
  @IsNotEmpty()
  tagId: number;
}
