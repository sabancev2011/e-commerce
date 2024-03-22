import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth, Tokens } from './dto.ts';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAccessAuthGuard, JwtRefreshAuthGuard } from '../guards';
import { Request, Response } from 'express';
import { Cookie, Public, User, UserAgent } from 'src/decorators';
import { JwtPayload } from 'src/interfaces';

@Public()
@ApiTags('auth-controller')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @ApiOperation({ summary: 'Signup' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: Tokens
  })
  signup(
    @Body() authDto: Auth, 
    @Res({ passthrough: true }) res: Response, 
    @UserAgent() userAgent: string
    ) {
    return this.authService.signup(authDto, res, userAgent)
  }

  @Post('signin')
  @ApiOperation({ summary: 'Signin' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: Tokens,
  })
  signin(
    @Body() authDto: Auth, 
    @Res({ passthrough: true }) res: Response, 
    @UserAgent() userAgent: string
    ) {
    return this.authService.signin(authDto, res, userAgent)
  }

  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth('refresh_token')
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh tokens' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: Tokens
  })
  refreshTokens(
    @Cookie('refresh_token') refreshToken: string, 
    @User() user: JwtPayload, 
    @Res({ passthrough: true }) res: Response, 
    @UserAgent() userAgent: string
    ) {
    return this.authService.refreshTokens(user, refreshToken, res, userAgent)
  }

  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth('refresh_token')
  @Get('logout')
  @ApiOperation({ summary: 'Logout' })
  @HttpCode(HttpStatus.OK)
  logout(
    @Cookie('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response, 
    ) {
    return this.authService.deleteRefreshToken(refreshToken, res)
  }
}
