import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto extends PickType(CreateUserDto, [
  'username',
  'email',
  'password',
  'refresh_token',
] as const) {
  @IsString({ message: 'Confirm password must be a string' })
  @IsNotEmpty({ message: 'Confirm password is a required field' })
  confirmPassword: string;
}
