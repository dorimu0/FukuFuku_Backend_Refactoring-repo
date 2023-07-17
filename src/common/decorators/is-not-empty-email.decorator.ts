import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsEmail } from 'class-validator';

export function IsNotEmptyEmail() {
  return applyDecorators(
    IsNotEmpty(),
    IsEmail()
  );
}
