import { IsNotEmpty } from 'class-validator';

export class EditBoardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}
