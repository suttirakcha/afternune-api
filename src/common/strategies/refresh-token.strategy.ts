import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { type Request } from 'express';
import { JwtPayload } from '../../types/jwt-payload.type';
import { REFRESH_TOKEN_COOKIE } from '../../auth/constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies[REFRESH_TOKEN_COOKIE] as string,
      ]),
      secretOrKey: process.env.REFRESH_JWT_SECRET!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refresh_token = req
      .get('Authorization')
      ?.replace('Bearer', '')
      .trim();
    return { ...payload, refresh_token };
  }
}
