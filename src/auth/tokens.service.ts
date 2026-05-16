import { BadRequestException, Injectable } from '@nestjs/common';
import { ForgotPasswordPayload, JwtPayload } from '../types/jwt-payload.type';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { type Response } from 'express';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './constants';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getTokens(payload: JwtPayload) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.access_secret'),
        expiresIn: this.configService.get('jwt.access_expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refresh_secret'),
        expiresIn: this.configService.get('jwt.refresh_expiresIn'),
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async generateResetPasswordToken(payload: { email: string }) {
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.reset_password_secret'),
      expiresIn: this.configService.get('jwt.reset_password_expiresIn'),
    });

    return token;
  }

  async verifyResetPasswordToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<ForgotPasswordPayload>(
        token,
        {
          secret: this.configService.get('jwt.reset_password_secret'),
          algorithms: ['HS256'],
        },
      );

      return payload;
    } catch (error: unknown) {
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException({
          code: 'INVALID_TOKEN',
          message:
            'Looks like the link you tried to access has expired or is invalid, please try again.',
        });
      }
    }
  }

  setNewCookies(res: Response, access_token: string, refresh_token: string) {
    res.cookie(ACCESS_TOKEN_COOKIE, access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    res.cookie(REFRESH_TOKEN_COOKIE, refresh_token, {
      maxAge: 7 * 30 * 24 * 60 * 60,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }

  clearCookies(res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
  }
}
