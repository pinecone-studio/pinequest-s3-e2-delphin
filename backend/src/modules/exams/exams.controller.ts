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
  type CreateExamDto,
  type Exam,
  type UpdateExamDto,
} from './exams.types';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  async findAll(): Promise<Exam[]> {
    return executeOrRethrowAsync(
      () => this.examsService.findAll(),
      'Failed to handle GET /exams',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Exam> {
    return executeOrRethrowAsync(
      () => this.examsService.findOne(id),
      `Failed to handle GET /exams/${id}`,
    );
  }

  @Post()
  async create(@Body() payload: CreateExamDto): Promise<Exam> {
    return executeOrRethrowAsync(
      () => this.examsService.create(payload),
      `Failed to handle POST /exams for title ${payload.title}`,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateExamDto,
  ): Promise<Exam> {
    return executeOrRethrowAsync(
      () => this.examsService.update(id, payload),
      `Failed to handle PATCH /exams/${id}`,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Exam> {
    return executeOrRethrowAsync(
      () => this.examsService.remove(id),
      `Failed to handle DELETE /exams/${id}`,
    );
  }

  @Get(':id/attempts/live')
  async getLiveAttempts(@Param('id') id: string): Promise<any[]> {
    return executeOrRethrowAsync(
      () => this.examsService.getLiveAttempts(id),
      `Failed to handle GET /exams/${id}/attempts/live`,
    );
  }
}
