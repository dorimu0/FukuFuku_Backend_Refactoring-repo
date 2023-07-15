import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  InternalServerErrorException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokens = this.extractTokenFromBody(request);

    if (!tokens['refreshToken'] || !tokens['accessToken']) {
      throw new UnprocessableEntityException();
    }

    try {
      await this.jwtService.verifyAsync(
        tokens['refreshToken'],
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET')
        }
      );

      const newAccesstoken = await this.authService.refresh(tokens);

      if (!newAccesstoken) {
        throw new UnauthorizedException();
      }

      request['body']['accessToken'] = newAccesstoken;

      return true;
    } catch (error) {
      const errorName = error?.name;

      if (errorName === 'TokenExpiredError'
        || errorName === 'JsonWebTokenError'
        || errorName === 'UnauthorizedException') {

        const response = context.switchToHttp().getResponse();

        await this.reLogin(response);
      }
      else {
        throw new InternalServerErrorException(error.name);
      }
    }
  }

  async reLogin(response: Response) {
    const loginUrl = this.configService.get<string>('GOAUTH_RELOGIN_URL');
    response.redirect(loginUrl);
  }

  private extractTokenFromBody(request: Request): object | undefined {
    try {
      const [accessTokenType, accessToken] = request.headers.authorization.split(' ') ?? [];
      const [refreshTokenType, refreshToken] = request.body['refreshToken'].split(' ') ?? [];

      return (refreshTokenType === 'Bearer' || accessTokenType === 'Bearer')
        ? { accessToken, refreshToken }
        : undefined;
    } catch (error) {
      throw new UnprocessableEntityException(error.name);
    }
  }
}