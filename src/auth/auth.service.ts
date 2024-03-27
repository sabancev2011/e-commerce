import { compareSync } from 'bcrypt';
import { $Enums } from '@prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { PrismaService } from '../prisma/prisma.service';
import { AuthSigninModel, AuthSignupModel } from './dto.ts';
import { UserService } from '../user/user.service.js';
import { JwtPayload } from 'src/interfaces';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) { }

    private async getTokens(userId: string, email: string, roles: $Enums.Role[]) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email,
                roles: [...roles]
            }, {
                secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
                expiresIn: '10m'
            }),
            this.jwtService.signAsync({
                sub: userId,
                email,
                roles: [...roles]
            }, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
                expiresIn: '10m'
            })
        ])
        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }

    private setRefreshTokenInCookies(refreshToken: string, res: Response) {
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            expires: new Date(this.jwtService.decode(refreshToken).exp * 1000),
            secure: this.configService.get<string>('NODE_ENV', 'development') === 'production'
        })
    }

    private async setRefreshToken(userId: string, refreshToken: string, userAgent: string, res: Response) {
        const userAgentToken = await this.prismaService.refreshToken.findFirst({
            where: {
                userId,
                userAgent
            }
        })

        const setedToken = await this.prismaService.refreshToken.upsert({
            where: { token: userAgentToken?.token ?? '' },
            update: {
                token: refreshToken,
                exp: new Date(this.jwtService.decode(refreshToken).exp * 1000)
            },
            create: {
                userId,
                token: refreshToken,
                exp: new Date(this.jwtService.decode(refreshToken).exp * 1000),
                userAgent
            }
        })

        this.setRefreshTokenInCookies(refreshToken, res)
        return setedToken
    }

    async signup(auth: AuthSignupModel, res: Response, userAgent: string) {
        const user = await this.userService.create(auth);
        const { access_token, refresh_token } = await this.getTokens(user.id, user.email, user.roles)
        await this.setRefreshToken(user.id, refresh_token, userAgent, res)
        return { access_token }
    }

    async signin(auth: AuthSigninModel, res: Response, userAgent: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: auth.email
            }
        })
        if (!user || !compareSync(auth.password, user.password)) {
            throw new UnauthorizedException('Incorrect login or password')
        }
        const { access_token, refresh_token } = await this.getTokens(user.id, user.email, user.roles)
        await this.setRefreshToken(user.id, refresh_token, userAgent, res)
        return { access_token }
    }

    async refreshTokens(user: JwtPayload, refreshToken: string, res: Response, userAgent: string) {

        const matchedRefreshToken = await this.prismaService.refreshToken.findUnique({
            where: {
                token: refreshToken
            }
        })
        if (!matchedRefreshToken) {
            throw new UnauthorizedException()
        }
        const { access_token, refresh_token } = await this.getTokens(user.sub, user.email, user.roles)
        await this.setRefreshToken(user.sub, refresh_token, userAgent, res)
        return { access_token }
    }

    async deleteRefreshToken(token: string, res: Response) {
        await this.prismaService.refreshToken.delete({ where: { token } })
        res.cookie('refresh_token', '', {
            httpOnly: true,
            expires: new Date(),
            secure: true
        })
    }
}