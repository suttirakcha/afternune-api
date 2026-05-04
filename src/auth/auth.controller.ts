import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { type Response, type Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(
    @CurrentUser('sub') sub: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(sub, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @CurrentUser('sub') sub: string,
    @CurrentUser('refresh_token') refresh_token: string,
  ) {
    return this.authService.refreshTokens(sub, refresh_token);
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getProfile(@CurrentUser('sub') sub: string) {
    return this.authService.getProfile(sub);
  }
}
