import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GOauthService } from './g-oauth/g-oauth.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('google')
export class AuthController {

  constructor(
    private readonly gOauthService: GOauthService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) { }

  @Get()
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() req) {
  }

  @Get(process.env.CALLBACK_PATH)
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const googleUserInfo = this.gOauthService.googleLogin(req);

    // 로그인
    this.userService.sign(googleUserInfo);

    // access token
    const access_token = await this.authService.generateAccessToken(googleUserInfo);

    // refres token 저장
    const refreshToken = await this.authService.generateRefreshToken(googleUserInfo);
    console.log(refreshToken);
    this.userService.sign({ ...googleUserInfo, refreshToken: refreshToken });

    return access_token;
    // jwt 토큰 발급 후 사용자의 정보와 함께 넘김

    // 페이로드, 옵션 기반으로 jwt 발급
    //   const token = this.jwtService.sign(payload, options)

    //   // 로그인 인증을 할 때는 decode 된 값이 있는지 확인
    //   const dToken = this.jwtService.decode(token)
    //   console.log(token)
    //   console.log(dToken)
    //   console.log(this.authService.getAll())

    //   return {
    //     token: token,
    //     data: infoForReq
    //   }
  }
}
