import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Trim } from '../../common/decorators/trim.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The username of the user', example: 'Jennie' })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is a required field' })
  @Trim()
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'jennie@mail.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is a required field' })
  @Trim()
  email: string;

  @ApiProperty({
    description: 'The password of the user that must be at least 6 characters',
    example: 'jennie123',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is a required field' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    description: 'The bio of the user',
    example: 'I am a user who is interested in coding',
  })
  @IsString()
  @IsOptional()
  bio?: string;
}
