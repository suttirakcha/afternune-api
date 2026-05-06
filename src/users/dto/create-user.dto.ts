import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Trim } from '../../common/decorators/trim.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, Interests, Role } from '../../types/users.type';

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
    description: 'The password of the user that must be at least 8 characters',
    example: 'jennie123',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsNotEmpty({ message: 'Password is a required field' })
  password: string;

  @IsString()
  refresh_token: string;

  @ApiProperty({
    description: 'The bio of the user',
    example: 'I am a user who is interested in coding',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    description: 'The interests of the user',
    example: 'Music, Entertainment, Sports',
  })
  @IsEnum(Interests, { each: true })
  @IsOptional()
  interests?: Interests[];

  @ApiProperty({
    description: 'The role of the user',
    example: 'User, Admin, Community creator',
  })
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    description: 'The gender of the user',
    example: 'Male, Female, Not Specified',
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
