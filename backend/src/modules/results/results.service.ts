import { Injectable, NotFoundException } from '@nestjs/common';
import {
  executeOrRethrowAsync,
  rethrowAsInternal,
} from '../../common/error-handling';
import { DatabaseService } from '../../database/database.service';

export type Result = {
  id: string;
  submissionId: string;
  score: number;
  passed: boolean;
};

export type CreateResultDto = Result;
export type UpdateResultDto = Partial<Omit<Result, 'id'>>;

@Injectable()
export class ResultsService {
  private readonly results: Result[] = [
    {
      id: 'result-1',
      submissionId: 'submission-1',
      score: 82,
      passed: true,
    },
  ];

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Result[]> {
    return executeOrRethrowAsync(async () => {
      if (this.databaseService.isConfigured()) {
        const rows = await this.databaseService.query<{
          id: string;
          submissionId: string;
          score: number;
          passed: number;
        }>(
          `SELECT id, submission_id as submissionId, score, passed
           FROM results ORDER BY id`,
        );

        return rows.map((row) => ({
          ...row,
          passed: Boolean(row.passed),
        }));
      }

      return this.results;
    }, 'Failed to list results from the store');
  }

  async findOne(id: string): Promise<Result> {
    try {
      if (this.databaseService.isConfigured()) {
        const row = await this.databaseService.queryFirst<{
          id: string;
          submissionId: string;
          score: number;
          passed: number;
        }>(
          `SELECT id, submission_id as submissionId, score, passed
           FROM results WHERE id = ? LIMIT 1`,
          [id],
        );

        if (!row) {
          throw new NotFoundException(`Result ${id} not found`);
        }

        return {
          ...row,
          passed: Boolean(row.passed),
        };
      }

      const result = this.results.find((item) => item.id === id);
      if (!result) {
        throw new NotFoundException(`Result ${id} not found`);
      }
      return result;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load result ${id}`);
    }
  }

  async create(payload: CreateResultDto): Promise<Result> {
    try {
      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          `INSERT INTO results (id, submission_id, score, passed)
           VALUES (?, ?, ?, ?)`,
          [payload.id, payload.submissionId, payload.score, payload.passed ? 1 : 0],
        );
        return payload;
      }

      this.results.push(payload);
      return payload;
    } catch (error) {
      rethrowAsInternal(error, `Failed to create result ${payload.id}`);
    }
  }

  async update(id: string, payload: UpdateResultDto): Promise<Result> {
    try {
      const result = await this.findOne(id);
      const updated = { ...result, ...payload };

      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          `UPDATE results SET submission_id = ?, score = ?, passed = ? WHERE id = ?`,
          [updated.submissionId, updated.score, updated.passed ? 1 : 0, id],
        );
        return updated;
      }

      Object.assign(result, payload);
      return result;
    } catch (error) {
      rethrowAsInternal(error, `Failed to update result ${id}`);
    }
  }

  async remove(id: string): Promise<Result> {
    try {
      const result = await this.findOne(id);

      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute('DELETE FROM results WHERE id = ?', [id]);
        return result;
      }

      const index = this.results.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`Result ${id} not found`);
      }
      const [removed] = this.results.splice(index, 1);
      return removed;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete result ${id}`);
    }
  }
}
