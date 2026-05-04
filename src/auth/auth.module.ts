import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from '../users/schemas/users.schema';
import { SecuritiesModule } from '../shared/securities/securities.module';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from '../common/strategies/access-token.strategy';
import { RefreshTokenStrategy } from '../common/strategies/refresh-token.strategy';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    UsersModule,
    SecuritiesModule,
    PassportModule.register({ session: true }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UsersSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    TokensService,
  ],
})
export class AuthModule {}
