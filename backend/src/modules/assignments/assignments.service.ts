import { Injectable, NotFoundException } from '@nestjs/common';
import {
  executeOrRethrowAsync,
  rethrowAsInternal,
} from '../../common/error-handling';
import { DatabaseService } from '../../database/database.service';

export type Assignment = {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: string;
};

export type CreateAssignmentDto = Assignment;
export type UpdateAssignmentDto = Partial<Omit<Assignment, 'id'>>;

@Injectable()
export class AssignmentsService {
  private readonly assignments: Assignment[] = [
    {
      id: 'assignment-1',
      assessmentId: 'assessment-1',
      candidateId: 'u-candidate-1',
      status: 'assigned',
    },
  ];

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Assignment[]> {
    return executeOrRethrowAsync(async () => {
      if (this.databaseService.isConfigured()) {
        return await this.databaseService.query<Assignment>(
          `SELECT id, assessment_id as assessmentId, candidate_id as candidateId, status
           FROM assignments ORDER BY id`,
        );
      }

      return this.assignments;
    }, 'Failed to list assignments from the store');
  }

  async findOne(id: string): Promise<Assignment> {
    try {
      if (this.databaseService.isConfigured()) {
        const assignment = await this.databaseService.queryFirst<Assignment>(
          `SELECT id, assessment_id as assessmentId, candidate_id as candidateId, status
           FROM assignments WHERE id = ? LIMIT 1`,
          [id],
        );
        if (!assignment) {
          throw new NotFoundException(`Assignment ${id} not found`);
        }
        return assignment;
      }

      const assignment = this.assignments.find((item) => item.id === id);
      if (!assignment) {
        throw new NotFoundException(`Assignment ${id} not found`);
      }
      return assignment;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load assignment ${id}`);
    }
  }

  async create(payload: CreateAssignmentDto): Promise<Assignment> {
    try {
      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          `INSERT INTO assignments (id, assessment_id, candidate_id, status)
           VALUES (?, ?, ?, ?)`,
          [payload.id, payload.assessmentId, payload.candidateId, payload.status],
        );
        return payload;
      }

      this.assignments.push(payload);
      return payload;
    } catch (error) {
      rethrowAsInternal(error, `Failed to create assignment ${payload.id}`);
    }
  }

  async update(id: string, payload: UpdateAssignmentDto): Promise<Assignment> {
    try {
      const assignment = await this.findOne(id);
      const updated = { ...assignment, ...payload };

      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          `UPDATE assignments SET assessment_id = ?, candidate_id = ?, status = ?
           WHERE id = ?`,
          [updated.assessmentId, updated.candidateId, updated.status, id],
        );
        return updated;
      }

      Object.assign(assignment, payload);
      return assignment;
    } catch (error) {
      rethrowAsInternal(error, `Failed to update assignment ${id}`);
    }
  }

  async remove(id: string): Promise<Assignment> {
    try {
      const assignment = await this.findOne(id);

      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute('DELETE FROM assignments WHERE id = ?', [id]);
        return assignment;
      }

      const index = this.assignments.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`Assignment ${id} not found`);
      }
      const [removed] = this.assignments.splice(index, 1);
      return removed;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete assignment ${id}`);
    }
  }
}
