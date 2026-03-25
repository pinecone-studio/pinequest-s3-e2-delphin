import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { executeOrRethrowAsync } from '../../common/error-handling';
import {
  type CreateExamDto,
  type Exam,
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
}
