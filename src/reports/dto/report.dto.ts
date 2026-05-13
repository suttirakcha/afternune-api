import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ReportType } from '../../types/reports.type';

export class ReportDto {
  @IsEnum(ReportType)
  type: ReportType;

  @IsString()
  reason: string;

  @ValidateIf((o: ReportDto) => o.type === ReportType.POST)
  @IsNotEmpty()
  post_id: string;

  @ValidateIf((o: ReportDto) => o.type === ReportType.COMMUNITY)
  @IsNotEmpty()
  community_id: string;

  @ValidateIf((o: ReportDto) => o.type === ReportType.USER)
  @IsNotEmpty()
  user_id: string;

  @IsBoolean()
  @IsOptional()
  is_solved?: boolean;
}
