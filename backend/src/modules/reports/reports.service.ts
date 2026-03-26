import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

export type ReportsSummary = {
  completionRate: number;
  coverage: number;
  averageScore: number;
  passRate: number;
};

@Injectable()
export class ReportsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getSummary(): Promise<ReportsSummary> {
    if (!this.databaseService.isConfigured()) {
      return {
        completionRate: 100,
        coverage: 1,
        averageScore: 82,
        passRate: 100,
      };
    }

    const [resultsCountRow, averageRow, passedRow] = await Promise.all([
      this.databaseService.queryFirst<{ total: number }>(
        'SELECT COUNT(*) as total FROM results',
      ),
      this.databaseService.queryFirst<{ averageScore: number | null }>(
        'SELECT AVG(score) as averageScore FROM results',
      ),
      this.databaseService.queryFirst<{ passedCount: number }>(
        'SELECT COUNT(*) as passedCount FROM results WHERE passed = 1',
      ),
    ]);

    const total = resultsCountRow?.total ?? 0;
    const passed = passedRow?.passedCount ?? 0;
    const averageScore = averageRow?.averageScore ?? 0;

    return {
      completionRate: total > 0 ? 100 : 0,
      coverage: total > 0 ? 1 : 0,
      averageScore: Math.round(averageScore),
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
    };
  }
}
