import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './schemas/reports.schema';
import { Model } from 'mongoose';
import { ReportDto } from './dto/report.dto';
import { ReportType } from '../types/reports.type';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report.name) private reportsModel: Model<Report>) {}

  async getReports() {
    const reports = await this.reportsModel.find();
    return reports;
  }

  async createReport(id: string, reportDto: ReportDto) {
    const data_id =
      reportDto.type === ReportType.USER
        ? 'user_id'
        : reportDto.type === ReportType.POST
          ? 'post_id'
          : reportDto.type === ReportType.COMMUNITY
            ? 'community_id'
            : 'id';

    const report = await this.reportsModel.insertOne({
      [data_id]: id,
      ...reportDto,
    });

    if (!report) {
      throw new BadRequestException({
        code: 'FAILED_TO_SUBMIT',
        message: 'Failed to submit the report, please try again',
      });
    }

    return {
      message: `You have successfully submit the report`,
    };
  }
}
