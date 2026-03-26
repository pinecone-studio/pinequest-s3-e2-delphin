import { Injectable, NotFoundException } from '@nestjs/common';
import {
  executeOrRethrowAsync,
  rethrowAsInternal,
} from '../../common/error-handling';
import { DatabaseService } from '../../database/database.service';

export type Course = {
  id: string;
  title: string;
  type: string;
};

export type CreateCourseDto = Course;
export type UpdateCourseDto = Partial<Omit<Course, 'id'>>;

@Injectable()
export class CoursesService {
  private readonly courses: Course[] = [
    {
      id: 'course-safety',
      title: 'Workplace Safety Basics',
      type: 'training',
    },
  ];

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Course[]> {
    return executeOrRethrowAsync(async () => {
      if (this.databaseService.isConfigured()) {
        return await this.databaseService.query<Course>(
          'SELECT id, title, type FROM courses ORDER BY id',
        );
      }

      return this.courses;
    }, 'Failed to list courses from the store');
  }

  async findOne(id: string): Promise<Course> {
    try {
      if (this.databaseService.isConfigured()) {
        const course = await this.databaseService.queryFirst<Course>(
          'SELECT id, title, type FROM courses WHERE id = ? LIMIT 1',
          [id],
        );
        if (!course) {
          throw new NotFoundException(`Course ${id} not found`);
        }
        return course;
      }

      const course = this.courses.find((item) => item.id === id);
      if (!course) {
        throw new NotFoundException(`Course ${id} not found`);
      }
      return course;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load course ${id}`);
    }
  }

  async create(payload: CreateCourseDto): Promise<Course> {
    try {
      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          'INSERT INTO courses (id, title, type) VALUES (?, ?, ?)',
          [payload.id, payload.title, payload.type],
        );
        return payload;
      }

      this.courses.push(payload);
      return payload;
    } catch (error) {
      rethrowAsInternal(error, `Failed to create course ${payload.id}`);
    }
  }

  async update(id: string, payload: UpdateCourseDto): Promise<Course> {
    try {
      const course = await this.findOne(id);
      const updated = { ...course, ...payload };

      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          'UPDATE courses SET title = ?, type = ? WHERE id = ?',
          [updated.title, updated.type, id],
        );
        return updated;
      }

      Object.assign(course, payload);
      return course;
    } catch (error) {
      rethrowAsInternal(error, `Failed to update course ${id}`);
    }
  }

  async remove(id: string): Promise<Course> {
    try {
      const course = await this.findOne(id);

      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute('DELETE FROM courses WHERE id = ?', [id]);
        return course;
      }

      const index = this.courses.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`Course ${id} not found`);
      }
      const [removed] = this.courses.splice(index, 1);
      return removed;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete course ${id}`);
    }
  }
}
