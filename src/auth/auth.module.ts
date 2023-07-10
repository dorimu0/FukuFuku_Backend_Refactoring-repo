import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GOauthService } from './g-oauth/g-oauth.service';
import { GOuthStrategy } from './g-oauth/g-oauth.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [AuthService, GOauthService, GOuthStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }