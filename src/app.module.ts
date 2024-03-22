import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessAuthGuard, RolesGuard } from './guards';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard
    },
    {
      provide: APP_GUARD, 
      useClass: RolesGuard
    }
  ]
})
export class AppModule { }
