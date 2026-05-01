import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from '../users/schemas/users.schema';
import { Model } from 'mongoose';
import { BcryptService } from '../shared/securities/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    private readonly bcryptService: BcryptService,
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

    return { message: 'Logged in successfully', success: true };
  }

  async register(registerDto: RegisterDto) {
    const foundUser = await this.usersModel.findOne({
      $or: [{ username: registerDto.username }, { email: registerDto.email }],
    });

    if (foundUser) {
      throw new ConflictException({
        code: 'USER_ALREADY_EXISTS',
        message:
          'This user already exists, please try another username and/or email.',
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
}
