import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from '../users/schemas/users.schema';
import { SecuritiesModule } from '../shared/securities/securities.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    SecuritiesModule,
    PassportModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UsersSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
