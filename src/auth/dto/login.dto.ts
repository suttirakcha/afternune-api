import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { IsNotEmpty, Matches } from 'class-validator';
import { Trim } from '../../common/decorators/trim.decorator';

export class LoginDto extends PickType(CreateUserDto, ['password'] as const) {
  @IsNotEmpty({
    message: 'Username or email is a required field',
  })
  @Matches(/^([^\s@]+@[^\s@]+\.[^\s@]+|[a-zA-Z0-9_]{3,20})$/, {
    message:
      'Invalid syntax. If you are going to login using your email, please make sure that the @ sign is included.',
  })
  @Trim()
  identifier: string;
}
