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
};

export type CreateUserDto = User;
export type UpdateUserDto = Partial<Omit<User, 'id'>>;

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    { id: 'u-reviewer-1', username: 'AAAA', role: 'reviewer' },
    { id: 'u-candidate-1', username: 'BBBB', role: 'candidate' },
  ];

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<User[]> {
    return executeOrRethrowAsync(async () => {
      if (this.databaseService.isConfigured()) {
        return await this.databaseService.query<User>(
          'SELECT id, username, role FROM users ORDER BY id',
        );
      }

      return this.users;
    }, 'Failed to list users from the store');
  }

  async findOne(id: string): Promise<User> {
    try {
      if (this.databaseService.isConfigured()) {
        const user = await this.databaseService.queryFirst<User>(
          'SELECT id, username, role FROM users WHERE id = ? LIMIT 1',
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
          'INSERT INTO users (id, username, role) VALUES (?, ?, ?)',
          [payload.id, payload.username, payload.role],
        );
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
          'UPDATE users SET username = ?, role = ? WHERE id = ?',
          [updated.username, updated.role, id],
        );
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
        await this.databaseService.execute('DELETE FROM users WHERE id = ?', [id]);
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
}
