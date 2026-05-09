import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/users.schema';
import { Model } from 'mongoose';
import { BcryptService } from '../shared/securities/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { TokensService } from './tokens.service';
import { JwtPayload } from '../types/jwt-payload.type';
import { type Response } from 'express';
import { Role } from '../types/users.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly tokensService: TokensService,
  ) {}
  async login(loginDto: LoginDto, res: Response) {
    const foundUser = await this.usersModel.findOne({
      $or: [{ username: loginDto.identifier }, { email: loginDto.identifier }],
    });

    if (!foundUser) {
      throw new BadRequestException({
        code: 'INCORRECT_CREDENTIALS',
        message: 'Username, email or password is incorrect, please try again.',
      });
    }

    const isPasswordMatch = await this.bcryptService.compare(
      loginDto.password,
      foundUser.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException({
        code: 'INCORRECT_CREDENTIALS',
        message: 'Username, email or password is incorrect, please try again.',
      });
    }

    const payload: JwtPayload = {
      sub: foundUser.id,
      role: foundUser.role ?? Role.USER,
      refresh_token: foundUser.refresh_token,
    };

    const tokens = await this.tokensService.getTokens(payload);
    await this.updateRefreshToken(foundUser.id, tokens.refresh_token);

    this.tokensService.setNewCookies(
      res,
      tokens.access_token,
      tokens.refresh_token,
    );
    return { message: 'Logged in successfully', success: true, ...tokens };
  }

  async register(registerDto: RegisterDto) {
    const foundUser = await this.usersModel.findOne({
      $or: [{ username: registerDto.username }, { email: registerDto.email }],
    });

    if (foundUser) {
      throw new ConflictException({
        code: 'ACCOUNT_ALREADY_EXISTS',
        message:
          'This account already exists, please try another username and/or email.',
      });
    }

    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException({
        code: 'PASSWORD_NOT_MATCH',
        message: 'Password does not match',
      });
    }

    const hashedPassword = await this.bcryptService.hash(registerDto.password);

    const newUser = await this.usersModel.insertOne({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = {
      sub: newUser.id,
      role: Role.USER,
      refresh_token: newUser.refresh_token,
    };

    const tokens = await this.tokensService.getTokens(payload);
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);

    return { message: 'Registered successfully', success: true };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.bcryptService.hash(refreshToken);
    await this.usersModel.updateOne(
      { _id: userId },
      { $set: { refresh_token: hashedRefreshToken } },
      { upsert: true },
    );
  }

  async refreshTokens(userId: string, refreshToken: string, res: Response) {
    const user = await this.usersModel.findById(userId);
    if (!user || !user.refresh_token) {
      throw new ForbiddenException({
        code: 'ACCESS_DENIED',
        message: "You don't have permission to access it",
      });
    }

    const isTokenMatch = await this.bcryptService.compare(
      refreshToken,
      user.refresh_token,
    );

    if (!isTokenMatch) {
      throw new ForbiddenException({
        code: 'ACCESS_DENIED',
        message: "You don't have permission to access it",
      });
    }

    const payload = {
      sub: user.id,
      role: user.role as Role,
      refresh_token: refreshToken,
    };

    const tokens = await this.tokensService.getTokens(payload);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    this.tokensService.setNewCookies(
      res,
      tokens.access_token,
      tokens.refresh_token,
    );
    return tokens;
  }

  async logout(userId: string, res: Response) {
    this.tokensService.clearCookies(res);
    await this.usersModel.updateOne({ _id: userId }, { refresh_token: null });
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const foundUser = await this.usersModel.findOne({
      $or: [{ email: forgotPasswordDto.email }],
    });

    if (!foundUser) {
      throw new NotFoundException({
        code: 'ACCOUNT_NOT_FOUND',
        message:
          "Sorry, we couldn't find an account associated with your email",
      });
    }

    return {
      message:
        'Your request for resetting the password has been sent to your email, please check your email.',
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials',
      });
    }
    return user;
  }
}
