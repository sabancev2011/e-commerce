import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { STRATEGES } from './strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGES],
  imports: [JwtModule, UserModule, PassportModule]
})
export class AuthModule { }