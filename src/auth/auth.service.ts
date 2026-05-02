import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/users.schema';
import { Model } from 'mongoose';
import { BcryptService } from '../shared/securities/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const foundUser = await this.usersModel.findOne({
      $or: [{ username: loginDto.identifier }, { email: loginDto.identifier }],
    });

    if (!foundUser) {
      throw new BadRequestException({
        code: 'INCORRECT_CREDENTIALS',
        message: 'Username, email or password is incorrect, please try again.',
        success: false,
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
        success: false,
      });
    }

    const payload = {
      sub: foundUser._id,
      username: foundUser.username,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return { message: 'Logged in successfully', success: true, access_token };
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
        success: false,
      });
    }

    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException({
        code: 'PASSWORD_NOT_MATCH',
        message: 'Password does not match',
        success: false,
      });
    }

    const hashedPassword = await this.bcryptService.hash(registerDto.password);

    await this.usersModel.insertOne({
      ...registerDto,
      password: hashedPassword,
    });

    return { message: 'Registered successfully', success: true };
  }

  validateUser(userId: string) {
    return this.usersModel.findById(userId);
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
        success: false,
      });
    }

    return {
      message:
        'Your request for resetting the password has been sent to your email, please check your email.',
    };
  }
}
