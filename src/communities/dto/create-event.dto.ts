import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommunityEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Event name is a required field' })
  event_name: string;

  @IsString()
  @IsNotEmpty({ message: 'Event detail is a required field' })
  event_detail: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'Start date is a required field' })
  start_date: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'End date is a required field' })
  end_date: Date;
}
