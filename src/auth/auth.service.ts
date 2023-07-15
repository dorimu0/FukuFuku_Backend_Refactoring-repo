import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserInfo } from './entity/userInfo.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GOauthService } from './g-oauth/g-oauth.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly gOauthService: GOauthService,
  ) {}

  async signByGOuth(req) {
    const googleUserInfo: User = this.gOauthService.googleLogin(req);

    if (
      googleUserInfo.email.split('@')[1] !==
      this.configService.get<string>('YEUNGJIN_EMAIL_FORMAT')
    ) {
      throw new UnauthorizedException('영진전문대 학생만 사용할 수 있어요.');
    }
    // token
    const accessToken = await this.generateToken(
      googleUserInfo,
      'JWT_ACCESS_SECRET',
      'JWT_ACCESS_EXPRIESIN',
    );
    const refreshToken = await this.generateToken(
      googleUserInfo,
      'JWT_REFRESH_SECRET',
      'JWT_REFRESH_EXPRIESIN',
    );

    const userInfo = await this.userService.sign(googleUserInfo);

    return { ...userInfo, accessToken, refreshToken };
  }

  async refresh(tokens) {
    try {
      const emailFromAccessToken = await this.jwtService.decode(
        tokens.accessToken,
      );
      const emailFromRefreshToken = await this.jwtService.decode(
        tokens.refreshToken,
      );

      if (emailFromAccessToken === null || emailFromRefreshToken === null) {
        return false;
      }
      if (emailFromAccessToken['email'] !== emailFromRefreshToken['email']) {
        return false;
      }

      const userInfo = await this.userService.user(
        emailFromRefreshToken['email'],
      );

      const newAccesstoken = await this.generateToken(
        userInfo,
        'JWT_ACCESS_SECRET',
        'JWT_ACCESS_EXPRIESIN',
      );

      return newAccesstoken;
    } catch (error) {
      return false;
    }
  }

  async generateToken(
    userInfo: User,
    type: string,
    expiresIn: string,
  ): Promise<string> {
    const payload = {
      email: userInfo?.email,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(type),
      expiresIn: this.configService.get<string>(expiresIn),
    });

    return 'Bearer ' + token;
  }
}
