import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { executeOrRethrowAsync } from '../../common/error-handling';
import {
  type CreateUserDto,
  type UpdateUserDto,
  type User,
  UsersService,
} from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return executeOrRethrowAsync(
      () => this.usersService.findAll(),
      'Failed to handle GET /users',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return executeOrRethrowAsync(
      () => this.usersService.findOne(id),
      `Failed to handle GET /users/${id}`,
    );
  }

  @Post()
  async create(@Body() payload: CreateUserDto): Promise<User> {
    return executeOrRethrowAsync(
      () => this.usersService.create(payload),
      `Failed to handle POST /users for payload id ${payload.id}`,
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateUserDto): Promise<User> {
    return executeOrRethrowAsync(
      () => this.usersService.update(id, payload),
      `Failed to handle PATCH /users/${id}`,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return executeOrRethrowAsync(
      () => this.usersService.remove(id),
      `Failed to handle DELETE /users/${id}`,
    );
  }
}
