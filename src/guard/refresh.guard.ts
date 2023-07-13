import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = this.extractTokenFromBody(request);

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const token = await this.authService.generateAccessToken({
        refreshToken,
      });

      request['body']['accessToken'] = token;

      return true;
    } catch (error) {
      switch (error?.name) {
        case 'TokenExpiredError':
          throw new UnauthorizedException(error);
        default: {
          const response = context.switchToHttp().getResponse();
          await this.reLogin(response);
          return false;
        }
      }
    }
  }

  async reLogin(response: Response) {
    const loginUrl = this.configService.get<string>('GOAUTH_RELOGIN_URL');
    response.redirect(loginUrl);
  }

  private extractTokenFromBody(request: Request): string | undefined {
    // const [type, token] = request.headers.authorization?.split(' ') ?? [];;
    const refreshToken = request.body['refreshToken'];

    return refreshToken ? refreshToken : undefined;
  }
}
