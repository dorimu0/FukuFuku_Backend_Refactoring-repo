import { Injectable } from '@nestjs/common';
import { JwtService as JWT } from '@nestjs/jwt';
import { UserInfo } from '../entity/userInfo.entity';

@Injectable()
export class JwtService {
  constructor(private readonly JWT: JWT) { }

  extract(userInfo: UserInfo){

    const payload = {
      email: userInfo.email,
      sub: userInfo.email
    };

    const options = {
      secret : "sadasdsdasdass"
    }

    // 페이로드, 옵션 기반으로 jwt 발급
    const token = this.JWT.sign(payload, options)
  }
}
