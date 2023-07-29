import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsNumber } from 'class-validator';

export function IsNotEmptyNumber() {
  return applyDecorators(
    IsNotEmpty(),
    IsNumber()
  );
}
