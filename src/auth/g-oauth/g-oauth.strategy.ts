import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

config();

console.log(process.env.CLIENT_ID)

@Injectable()
export class GOuthStrategy extends PassportStrategy(Strategy, 'google') {
  
  constructor() {
    const client = {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        scope: [process.env.GOAUTH_SCOPE_A, process.env.GOAUTH_SCOPE_Z],
    }
    super(client);
  }
  
  // 클라이언트로부터 받은 Authorization Code validation
  // 클라이언트가 보낸 Authorization Code 로 정보 발급 받기
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback):
    Promise<any> {
      const { name, emails, photos } = profile
      const user = {
        email: emails[0].value,
        firstName: name.familyName,
        lastName: name.givenName,
        picture: photos[0].value,
      }
      done(null, user);
    }
  }