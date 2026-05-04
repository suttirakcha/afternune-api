import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
}
