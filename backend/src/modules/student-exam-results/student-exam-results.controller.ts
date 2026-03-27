import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { executeOrRethrowAsync } from '../../common/error-handling';
import {
  type CreateStudentExamResultDto,
  StudentExamResultsService,
  type StudentExamResult,
} from './student-exam-results.service';

@Controller('student-exam-results')
export class StudentExamResultsController {
  constructor(
    private readonly studentExamResultsService: StudentExamResultsService,
  ) {}

  @Get()
  async findAll(
    @Query('examId') examId?: string,
    @Query('studentId') studentId?: string,
    @Query('classId') classId?: string,
  ): Promise<StudentExamResult[]> {
    return executeOrRethrowAsync(
      () =>
        this.studentExamResultsService.findAll({
          examId,
          studentId,
          classId,
        }),
      'Failed to handle GET /student-exam-results',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StudentExamResult> {
    return executeOrRethrowAsync(
      () => this.studentExamResultsService.findOne(id),
      `Failed to handle GET /student-exam-results/${id}`,
    );
  }

  @Post()
  async upsert(
    @Body() payload: CreateStudentExamResultDto,
  ): Promise<StudentExamResult> {
    return executeOrRethrowAsync(
      () => this.studentExamResultsService.upsert(payload),
      `Failed to handle POST /student-exam-results for ${payload.studentId}`,
    );
  }
}
