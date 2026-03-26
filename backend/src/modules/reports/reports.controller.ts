import { Controller, Get } from '@nestjs/common';
import { executeOrRethrowAsync } from '../../common/error-handling';
import { type ReportsSummary, ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  async getSummary(): Promise<ReportsSummary> {
    return executeOrRethrowAsync(
      () => this.reportsService.getSummary(),
      'Failed to handle GET /reports/summary',
    );
  }
}
