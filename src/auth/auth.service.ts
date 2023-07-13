import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserInfo } from './entity/userInfo.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GOauthService } from './g-oauth/g-oauth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly gOauthService: GOauthService,
  ) { }

  async signByGOuth(req) {
    const googleUserInfo = this.gOauthService.googleLogin(req);

    // token
    const accessToken = await this.generateAccessToken(googleUserInfo.email);
    const refreshToken = await this.generateRefreshToken(googleUserInfo);

    const userInfo = await this.userService.sign({ ...googleUserInfo, refreshToken: refreshToken });

    return { ...userInfo, accessToken };
  }

  async generateAccessToken(userInfo: UserInfo): Promise<string> {
    const payload = { email: userInfo.email }

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPRIESIN')
    });

    const refreshToken = "Bearer " + token;

    return refreshToken;
  }

  async generateRefreshToken(userInfo: UserInfo): Promise<string> {
    const payload = {
      email: userInfo.email,
    }

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPRIESIN'),
    });

    const accessToken = "Bearer " + token;

    return accessToken;
  }
}
