import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export default function IsNotEmptyString() {
  return applyDecorators(
    IsNotEmpty(),
    IsString()
  );
}
