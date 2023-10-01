import {
  Controller,
  Get,
  Req,
  UseGuards,
  Request,
  Body,
  Post,
} from '@nestjs/common';
import { RefreshGuard } from 'src/common/guard/refresh.guard';
import { AuthService } from './auth.service';
import { config } from 'dotenv';
import { responseFormat, OK, Created } from '../common/util/responseFormat';

config();

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async googleAuth(@Body('credential') credential) {
    const data = await this.authService.signByGOuth(credential);
    return data;
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    const accessToken = req.body.accessToken;

    return responseFormat(Created, { accessToken });
  }
}
