import { Controller, Get, Req, UseGuards, Request, Body, Post } from '@nestjs/common';
import { AuthGuard as pAauthGuard } from '@nestjs/passport';
import { AccessGuard } from '../guard/access.guard';
import { RefreshGuard } from 'src/guard/refresh.guard';
import { GOauthService } from './g-oauth/g-oauth.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { UserInfo } from './entity/userInfo.entity';
import { config } from 'dotenv';

config();

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Get()
  @UseGuards(pAauthGuard('google'))
  googleAuth(@Req() req) {}

  @Get(process.env.CALLBACK_PATH)
  @UseGuards(pAauthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const result = await this.authService.signByGOuth(req);
    return result;
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    const { accessToken } = req.body;

    return { accessToken };
  }
}
