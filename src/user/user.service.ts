import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { SignUserDto } from './dto/sign-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  user(email: string) {
    return this.userRepository.user({ email });
  }

  async signUp(userDto: CreateUserDto) {
    await this.userRepository.createUser(userDto);
  }

  // token(signUserDto: SignUserDto) {
  //   return this.userRepository.user({signUserDto.token});
  // }

  // refresh token 기간 끝 OR 가입
  async sign(userDto: CreateUserDto) {
    // 가입 여부 확인
    let userInfo = await this.user(userDto.email);

    if (userInfo) {
      await this.userRepository.updateUser({
        where: { email: userDto.email },
        data: { refreshToken: userDto.refreshToken },
      });

      return userInfo;
    }

    // 가입되지 않은 경우 자동 가입
    await this.signUp(userDto);

    userInfo = await this.user(userDto.email);

    return userInfo;
  }
}
