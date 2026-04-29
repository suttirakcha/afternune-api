import { BadRequestException, Injectable } from '@nestjs/common';
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

    return { message: 'Logged in successfully', foundUser };
  }

  async register(registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException({
        code: 'PASSWORD_NOT_MATCH',
        message: 'Password does not match',
      });
    }

    const hashedPassword = await this.bcryptService.hash(registerDto.password);
    const user = await this.usersModel.insertOne({
      ...registerDto,
      password: hashedPassword,
    });

    return { message: 'Registered successfully', user };
  }
}
