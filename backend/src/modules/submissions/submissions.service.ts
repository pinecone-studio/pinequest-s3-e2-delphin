import { Injectable, NotFoundException } from '@nestjs/common';
import {
  executeOrRethrowAsync,
  rethrowAsInternal,
} from '../../common/error-handling';
import { DatabaseService } from '../../database/database.service';

export type Submission = {
  id: string;
  assignmentId: string;
  status: string;
  submittedAt: string;
};

export type CreateSubmissionDto = Submission;
export type UpdateSubmissionDto = Partial<Omit<Submission, 'id'>>;

@Injectable()
export class SubmissionsService {
  private readonly submissions: Submission[] = [
    {
      id: 'submission-1',
      assignmentId: 'assignment-1',
      status: 'submitted',
      submittedAt: '2026-03-23T10:00:00Z',
    },
  ];

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Submission[]> {
    return executeOrRethrowAsync(async () => {
      if (this.databaseService.isConfigured()) {
        return await this.databaseService.query<Submission>(
          `SELECT id, assignment_id as assignmentId, status, submitted_at as submittedAt
           FROM submissions ORDER BY submitted_at DESC`,
        );
      }

      return this.submissions;
    }, 'Failed to list submissions from the store');
  }

  async findOne(id: string): Promise<Submission> {
    try {
      if (this.databaseService.isConfigured()) {
        const submission = await this.databaseService.queryFirst<Submission>(
          `SELECT id, assignment_id as assignmentId, status, submitted_at as submittedAt
           FROM submissions WHERE id = ? LIMIT 1`,
          [id],
        );
        if (!submission) {
          throw new NotFoundException(`Submission ${id} not found`);
        }
        return submission;
      }

      const submission = this.submissions.find((item) => item.id === id);
      if (!submission) {
        throw new NotFoundException(`Submission ${id} not found`);
      }
      return submission;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load submission ${id}`);
    }
  }

  async create(payload: CreateSubmissionDto): Promise<Submission> {
    try {
      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          `INSERT INTO submissions (id, assignment_id, status, submitted_at)
           VALUES (?, ?, ?, ?)`,
          [payload.id, payload.assignmentId, payload.status, payload.submittedAt],
        );
        return payload;
      }

      this.submissions.push(payload);
      return payload;
    } catch (error) {
      rethrowAsInternal(error, `Failed to create submission ${payload.id}`);
    }
  }

  async update(id: string, payload: UpdateSubmissionDto): Promise<Submission> {
    try {
      const submission = await this.findOne(id);
      const updated = { ...submission, ...payload };

      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          `UPDATE submissions SET assignment_id = ?, status = ?, submitted_at = ?
           WHERE id = ?`,
          [updated.assignmentId, updated.status, updated.submittedAt, id],
        );
        return updated;
      }

      Object.assign(submission, payload);
      return submission;
    } catch (error) {
      rethrowAsInternal(error, `Failed to update submission ${id}`);
    }
  }

  async remove(id: string): Promise<Submission> {
    try {
      const submission = await this.findOne(id);

      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute('DELETE FROM submissions WHERE id = ?', [id]);
        return submission;
      }

      const index = this.submissions.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`Submission ${id} not found`);
      }
      const [removed] = this.submissions.splice(index, 1);
      return removed;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete submission ${id}`);
    }
  }
}
