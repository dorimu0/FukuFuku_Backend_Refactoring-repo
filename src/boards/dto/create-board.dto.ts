import { IsNotEmpty } from '@nestjs/class-validator';

export class CreateBoardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  u_id: number;
}
