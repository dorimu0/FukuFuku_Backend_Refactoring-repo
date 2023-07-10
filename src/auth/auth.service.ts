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
    const userInfo = await this.userService.user(user.email);

    const payload = {
      email: user.email,
      id: userInfo.id,
    }

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPRIESIN,
    });

    return token;
  }

  // access 토큰 안되면 refresh 토큰 가져오기
  async refresh(token: string) {
    // decoded 토큰을 이용해 유저의 정보 가져오기
    const decodedToken = await this.jwtService.decode(token);
    console.log(decodedToken);
  }
}
