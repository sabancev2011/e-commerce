import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSigninModel, AuthSignupModel, TokenResponse } from './dto.ts';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtRefreshAuthGuard } from '../guards';
import { Response } from 'express';
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
    type: TokenResponse
  })
  signup(
    @Body() auth: AuthSignupModel, 
    @Res({ passthrough: true }) res: Response, 
    @UserAgent() userAgent: string
    ) {
    return this.authService.signup(auth, res, userAgent)
  }

  @Post('signin')
  @ApiOperation({ summary: 'Signin' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TokenResponse,
  })
  signin(
    @Body() auth: AuthSigninModel, 
    @Res({ passthrough: true }) res: Response, 
    @UserAgent() userAgent: string
    ) {
    return this.authService.signin(auth, res, userAgent)
  }

  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth('refresh_token')
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh tokens' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TokenResponse
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
