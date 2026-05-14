import { Role } from './users.type';

export type JwtPayload = {
  sub: string;
  role: Role;
  refresh_token: string;
};
