import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { SecuritiesModule } from './shared/securities/securities.module';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    JwtModule.register({ global: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dbName: 'afndatabase',
        uri: configService.getOrThrow('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    PostsModule,
    AuthModule,
    SecuritiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
