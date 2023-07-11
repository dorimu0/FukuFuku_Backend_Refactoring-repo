import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserInfo as User } from './entity/userInfo.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async generateAccessToken(email: string): Promise<string> {
    const payload = { email }

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPRIESIN')
    });
    // response.appendHeader('Authorization')
    // response.setHeader('Authorization',`Bearer ${token}`);
    return "Bearer " + token;
  }

  async generateRefreshToken(user: User): Promise<string> {
    const userInfo = await this.userService.user(user.email);

    const payload = {
      email: user.email,
      id: userInfo.id,
    }

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPRIESIN'),
    });

    return token;
  }

  // access 토큰 안되면 refresh 토큰 가져오기
  refresh(token: string) {
    // decoded 토큰을 이용해 유저의 정보 가져오기
    const decodedToken = this.jwtService.decode(token);
    return decodedToken;
  }
}
