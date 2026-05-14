import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './schemas/reports.schema';
import { Model, Types } from 'mongoose';
import { ReportDto } from './dto/report.dto';
import { ReportType } from '../types/reports.type';

const REPORT_AGGREGATE = [
  {
    $lookup: {
      from: 'posts',
      localField: 'post_id',
      foreignField: '_id',
      as: 'post',
    },
  },
  {
    $lookup: {
      from: 'communities',
      localField: 'community_id',
      foreignField: '_id',
      as: 'community',
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'user_id',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $lookup: {
      from: 'comments',
      localField: 'comment_id',
      foreignField: '_id',
      as: 'comment',
    },
  },
  {
    $addFields: {
      post: { $first: '$post' },
      community: { $first: '$community' },
      user: { $first: '$user' },
      comment: { $first: '$comment' },
    },
  },
];

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report.name) private reportsModel: Model<Report>) {}

  async getReports() {
    const reports =
      await this.reportsModel.aggregate<Report[]>(REPORT_AGGREGATE);
    return reports;
  }

  async getReportById(_id: string) {
    const [report] = await this.reportsModel.aggregate<Report>([
      {
        $match: {
          _id: new Types.ObjectId(_id),
        },
      },
      ...REPORT_AGGREGATE,
    ]);
    if (!report) {
      throw new NotFoundException({
        code: 'REPORT_NOT_FOUND',
        message: 'Report not found',
      });
    }

    return report;
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
