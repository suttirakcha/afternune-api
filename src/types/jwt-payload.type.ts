import { Role } from './users.type';

export type JwtPayload = {
  sub: string;
  role: Role;
  refresh_token: string;
};

export type ForgotPasswordPayload = {
  email: string;
  iat: number;
  exp: number;
};
