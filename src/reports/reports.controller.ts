import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportDto } from './dto/report.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getReports() {
    return this.reportsService.getReports();
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/report')
  createReport(@Body() reportDto: ReportDto, @Param('id') id: string) {
    return this.reportsService.createReport(id, reportDto);
  }
}
