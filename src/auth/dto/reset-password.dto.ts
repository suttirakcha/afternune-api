import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description:
      'The new password of the user for requesting to reset the password',
    example: 'jennie123',
  })
  @IsString({ message: 'New password must be a string' })
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  @IsNotEmpty({ message: 'New password is a required field' })
  password: string;
  newPassword: string;
}
