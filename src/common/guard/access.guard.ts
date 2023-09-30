import {
  CanActivate,
  ExecutionContext,
  Injectable,
  GoneException,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnprocessableEntityException();
    }
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      const client = this.jwtService.decode(token);

      request['body']['acessToken'] = token;
      request['body']['client'] = client;
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new GoneException(error);
      }
      // 만료된 경우가 아닐 시에 로그인 redirect
      const response = context.switchToHttp().getResponse();
      this.reLogin(response);
    }
    return true;
  }


  private extractTokenFromHeader(request: Request): string | undefined {
    try {
      const [type, token] = request.headers.authorization.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    } catch (error) {
      throw new UnprocessableEntityException(error.name);
    }
  }

  async reLogin(@Res() response: Response) {
    response.redirect(this.configService.get<string>('GOAUTH_RELOGIN_URL'));
  }
}
