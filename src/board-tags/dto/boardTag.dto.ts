import { IsNotEmpty, IsNumber } from 'class-validator';

export class BoardTagDto {
  @IsNumber()
  @IsNotEmpty()
  boardId: number;

  @IsNumber()
  @IsNotEmpty()
  tagId: number;
}
