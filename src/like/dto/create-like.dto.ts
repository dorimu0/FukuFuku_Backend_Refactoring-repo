import { IsNotEmptyNumber } from "src/common/decorators/is-not-empty-number.decorator";

export class LikeDto {
  @IsNotEmptyNumber()
  u_id: number;
  
  @IsNotEmptyNumber()
  b_id: number;
}