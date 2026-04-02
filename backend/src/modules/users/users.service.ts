import { Injectable, NotFoundException } from '@nestjs/common';
import {
  executeOrRethrowAsync,
  rethrowAsInternal,
} from '../../common/error-handling';
import { DatabaseService } from '../../database/database.service';

export type User = {
  id: string;
  username: string;
  role: string;
  email?: string;
  password?: string;
  classId?: string;
  subject?: string;
};

export type CreateUserDto = User;
export type UpdateUserDto = Partial<Omit<User, 'id'>>;

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 'u-reviewer-1',
      username: 'AAAA',
      role: 'reviewer',
      email: '',
      password: '',
    },
    {
      id: 'u-candidate-1',
      username: 'BBBB',
      role: 'candidate',
      email: '',
      password: '',
    },
    {
      id: 'teacher1',
      username: 'Амарбаясгалан',
      role: 'teacher',
      email: 'amarbaysgalan@school.com',
      password: 'amarbaysgalan123',
      subject: 'Математик',
    },
    {
      id: 's1',
      username: 'Бат-Эрдэнэ',
      role: 'student',
      email: 'baterdene@school.com',
      password: 'baterdene123',
      classId: '7A',
    },
    {
      id: 's2',
      username: 'Сарангэрэл',
      role: 'student',
      email: 'sarangerel@school.com',
      password: 'sarangerel123',
      classId: '7A',
    },
    {
      id: 's3',
      username: 'Тэмүүлэн',
      role: 'student',
      email: 'temuulen@school.com',
      password: 'temuulen123',
      classId: '7A',
    },
    {
      id: 's4',
      username: 'Номин',
      role: 'student',
      email: 'nomin@school.com',
      password: 'nomin123',
      classId: '7A',
    },
    {
      id: 's5',
      username: 'Энхжин',
      role: 'student',
      email: 'enkhjin@school.com',
      password: 'enkhjin123',
      classId: '7A',
    },
    {
      id: 's16',
      username: 'Нандин',
      role: 'student',
      email: 'nandin@school.com',
      password: 'nandin123',
      classId: '7A',
    },
  ];

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<User[]> {
    return executeOrRethrowAsync(async () => {
      if (this.databaseService.isConfigured()) {
        return await this.databaseService.query<User>(
          `SELECT
             users.id,
             users.username,
             users.role,
             users.email,
             users.password,
             student_profiles.class_id as classId,
             teacher_profiles.subject as subject
           FROM users
           LEFT JOIN student_profiles ON student_profiles.user_id = users.id
           LEFT JOIN teacher_profiles ON teacher_profiles.user_id = users.id
           ORDER BY users.id`,
        );
      }

      return this.users;
    }, 'Failed to list users from the store');
  }

  async findOne(id: string): Promise<User> {
    try {
      if (this.databaseService.isConfigured()) {
        const user = await this.databaseService.queryFirst<User>(
          `SELECT
             users.id,
             users.username,
             users.role,
             users.email,
             users.password,
             student_profiles.class_id as classId,
             teacher_profiles.subject as subject
           FROM users
           LEFT JOIN student_profiles ON student_profiles.user_id = users.id
           LEFT JOIN teacher_profiles ON teacher_profiles.user_id = users.id
           WHERE users.id = ?
           LIMIT 1`,
          [id],
        );
        if (!user) {
          throw new NotFoundException(`User ${id} not found`);
        }
        return user;
      }

      const user = this.users.find((item) => item.id === id);
      if (!user) {
        throw new NotFoundException(`User ${id} not found`);
      }
      return user;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load user ${id}`);
    }
  }

  async create(payload: CreateUserDto): Promise<User> {
    try {
      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          'INSERT INTO users (id, username, role, email, password) VALUES (?, ?, ?, ?, ?)',
          [
            payload.id,
            payload.username,
            payload.role,
            payload.email ?? '',
            payload.password ?? '',
          ],
        );
        await this.syncProfiles(payload.id, payload);
        return payload;
      }

      this.users.push(payload);
      return payload;
    } catch (error) {
      rethrowAsInternal(error, `Failed to create user ${payload.id}`);
    }
  }

  async update(id: string, payload: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);
      const updated = { ...user, ...payload };

      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          'UPDATE users SET username = ?, role = ?, email = ?, password = ? WHERE id = ?',
          [
            updated.username,
            updated.role,
            updated.email ?? '',
            updated.password ?? '',
            id,
          ],
        );
        await this.syncProfiles(id, updated);
        return updated;
      }

      Object.assign(user, payload);
      return user;
    } catch (error) {
      rethrowAsInternal(error, `Failed to update user ${id}`);
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const user = await this.findOne(id);

      if (this.databaseService.isConfigured()) {
        await this.databaseService.execute(
          'DELETE FROM student_profiles WHERE user_id = ?',
          [id],
        );
        await this.databaseService.execute(
          'DELETE FROM teacher_profiles WHERE user_id = ?',
          [id],
        );
        await this.databaseService.execute('DELETE FROM users WHERE id = ?', [
          id,
        ]);
        return user;
      }

      const index = this.users.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new NotFoundException(`User ${id} not found`);
      }
      const [removed] = this.users.splice(index, 1);
      return removed;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete user ${id}`);
    }
  }

  private async syncProfiles(
    id: string,
    user: Pick<User, 'role' | 'classId' | 'subject'>,
  ) {
    await this.databaseService.execute(
      'DELETE FROM student_profiles WHERE user_id = ?',
      [id],
    );
    await this.databaseService.execute(
      'DELETE FROM teacher_profiles WHERE user_id = ?',
      [id],
    );

    if (user.role === 'student' && user.classId?.trim()) {
      await this.databaseService.execute(
        'INSERT INTO student_profiles (user_id, class_id) VALUES (?, ?)',
        [id, user.classId.trim()],
      );
    }

    if (user.role === 'teacher' && user.subject?.trim()) {
      await this.databaseService.execute(
        'INSERT INTO teacher_profiles (user_id, subject) VALUES (?, ?)',
        [id, user.subject.trim()],
      );
    }
  }
}
