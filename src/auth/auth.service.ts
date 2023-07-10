import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserInfo as User } from './entity/userInfo.entity';
import { JwtService } from '@nestjs/jwt';
// import { config } from 'dotenv'
// config();

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  async generateAccessToken(user: User): Promise<string> {
    const payload = {
      email: user.email
    }

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPRIESIN
    });

    return token;
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPRIESIN,
    });

    return token;
  }

  // refresh token 저장
  async signIn(authorization) {

    const user = await this.userService.user(authorization.email);
  }

  // access 토큰 안되면 refresh 토큰 가져오기
  async refresh(token: string) {
    // decoded 토큰을 이용해 유저의 정보 가져오기
    const decodedToken = await this.jwtService.decode(token);
    console.log(decodedToken);
    // refresh 토큰 가져오기
    // const user = await this.userService.user({email:decodedToken.email});

    // refresh 체크 
    // if (user.refreshToken) {
    //   throw new UnauthorizedException();
    // }
  }
}

import { BadRequestException, NotFoundException } from '@nestjs/common';
// import { LoginDto } from './model/login.dto';
// import { Payload } from './payload/payload.interface';
// import { ConfigService } from '@nestjs/config';
