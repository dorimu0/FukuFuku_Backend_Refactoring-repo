import { IsNotEmpty } from 'class-validator';

export class CreateReplyDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  c_id: number;

  @IsNotEmpty()
  commenter: string;
}
