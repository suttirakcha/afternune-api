import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { SecuritiesModule } from './shared/securities/securities.module';
import configuration from './config/configuration';
import { APP_PIPE } from '@nestjs/core';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    PostsModule,
    AuthModule,
    SecuritiesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
  ],
})
export class AppModule {}
