import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BcryptService {
  constructor(private readonly configService: ConfigService) {}
  hash(data: string): Promise<string> {
    const SALT_ROUNDS: unknown = this.configService.get('bcrypt.salt', {
      infer: true,
    });
    return bcrypt.hash(data, Number(SALT_ROUNDS));
  }

  compare(data: string, digest: string) {
    return bcrypt.compare(data, digest);
  }
}
