import { Injectable, NotFoundException } from '@nestjs/common';
import {
  executeOrRethrowAsync,
  rethrowAsInternal,
} from '../../common/error-handling';
import { DatabaseService } from '../../database/database.service';

export type Assessment = {
  id: string;
  title: string;
  durationMinutes: number;
  passScore: number;
  attemptsAllowed: number;
};

export type CreateAssessmentDto = Assessment;
export type UpdateAssessmentDto = Partial<Omit<Assessment, 'id'>>;

@Injectable()
export class AssessmentsService {
  private readonly assessments: Assessment[] = [
    {
      id: 'assessment-1',
      title: 'Safety Fundamentals Exam',
      durationMinutes: 20,
      passScore: 70,
      attemptsAllowed: 1,
    },
  ];

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Assessment[]> {
    return executeOrRethrowAsync(async () => {
      if (this.databaseService.isConfigured()) {
        return await this.databaseService.query<Assessment>(
          `SELECT id, title, duration_minutes as durationMinutes,
           pass_score as passScore, attempts_allowed as attemptsAllowed
           FROM assessments ORDER BY id`,
        );
      }

      return this.assessments;
    }, 'Failed to list assessments from the store');
  }

  async findOne(id: string): Promise<Assessment> {
    try {
      if (this.databaseService.isConfigured()) {
        const assessment = await this.databaseService.queryFirst<Assessment>(
          `SELECT id, title, duration_minutes as durationMinutes,
           pass_score as passScore, attempts_allowed as attemptsAllowed
           FROM assessments WHERE id = ? LIMIT 1`,
          [id],
        );
        if (!assessment) {
          throw new NotFoundException(`Assessment ${id} not found`);
        }
        return assessment;
      }

      const assessment = this.assessments.find((item) => item.id === id);
      if (!assessment) {
        throw new NotFoundException(`Assessment ${id} not found`);
      }
      return assessment;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load assessment ${id}`);
    }
  }

  async create(payload: CreateAssessmentDto): Promise<Assessment> {
    try {
      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          `INSERT INTO assessments (
            id, title, duration_minutes, pass_score, attempts_allowed
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            payload.id,
            payload.title,
            payload.durationMinutes,
            payload.passScore,
            payload.attemptsAllowed,
          ],
        );
        return payload;
      }

      this.assessments.push(payload);
      return payload;
    } catch (error) {
      rethrowAsInternal(error, `Failed to create assessment ${payload.id}`);
    }
  }

  async update(id: string, payload: UpdateAssessmentDto): Promise<Assessment> {
    try {
      const assessment = await this.findOne(id);
      const updated = { ...assessment, ...payload };

      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          `UPDATE assessments
           SET title = ?, duration_minutes = ?, pass_score = ?, attempts_allowed = ?
           WHERE id = ?`,
          [
            updated.title,
            updated.durationMinutes,
            updated.passScore,
            updated.attemptsAllowed,
            id,
          ],
        );
        return updated;
      }

      Object.assign(assessment, payload);
      return assessment;
    } catch (error) {
      rethrowAsInternal(error, `Failed to update assessment ${id}`);
    }
  }

  async remove(id: string): Promise<Assessment> {
    try {
      const assessment = await this.findOne(id);

      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute('DELETE FROM assessments WHERE id = ?', [id]);
        return assessment;
      }

      const index = this.assessments.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`Assessment ${id} not found`);
      }
      const [removed] = this.assessments.splice(index, 1);
      return removed;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete assessment ${id}`);
    }
  }
}
