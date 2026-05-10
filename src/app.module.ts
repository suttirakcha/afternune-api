import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { SecuritiesModule } from './shared/securities/securities.module';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    JwtModule.register({
      global: true,
    }),
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
    CloudinaryModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [
    CloudinaryService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
  ],
})
export class AppModule {}
