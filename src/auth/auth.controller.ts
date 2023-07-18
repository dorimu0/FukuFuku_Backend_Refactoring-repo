import {
  Controller,
  Get,
  Req,
  UseGuards,
  Request,
  Body,
  Post,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessGuard } from '../common/guard/access.guard';
import { RefreshGuard } from 'src/common/guard/refresh.guard';
import { AuthService } from './auth.service';
import { config } from 'dotenv';
import { responseFormat, OK, Created } from '../common/util/responseFormat';

config();

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() req) {}

  @Get(process.env.CALLBACK_PATH)
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    req.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
    console.log(req.headers);
    const data = await this.authService.signByGOuth(req);
    return responseFormat(OK, data);
  }

  @HttpCode(201)
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    const accessToken = req.body.accessToken;

    return responseFormat(Created, { accessToken });
  }
}
