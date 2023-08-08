import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GOauthService {
  getHello(): string {
    throw new Error('Method not implemented.');
  }

  googleLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return req.user;
  }
}
