import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { executeOrRethrowAsync } from '../../common/error-handling';
import {
  StudentExamAttemptsService,
  type StudentExamAttempt,
  type StudentExamAttemptStatus,
  type UpsertStudentExamAttemptDto,
} from './student-exam-attempts.service';

@Controller('student-exam-attempts')
export class StudentExamAttemptsController {
  constructor(
    private readonly studentExamAttemptsService: StudentExamAttemptsService,
  ) {}

  @Get()
  async findAll(
    @Query('examId') examId?: string,
    @Query('studentId') studentId?: string,
    @Query('classId') classId?: string,
    @Query('status') status?: StudentExamAttemptStatus,
  ): Promise<StudentExamAttempt[]> {
    return executeOrRethrowAsync(
      () =>
        this.studentExamAttemptsService.findAll({
          examId,
          studentId,
          classId,
          status,
        }),
      'Failed to handle GET /student-exam-attempts',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StudentExamAttempt> {
    return executeOrRethrowAsync(
      () => this.studentExamAttemptsService.findOne(id),
      `Failed to handle GET /student-exam-attempts/${id}`,
    );
  }

  @Post()
  async upsert(
    @Body() payload: UpsertStudentExamAttemptDto,
  ): Promise<StudentExamAttempt> {
    return executeOrRethrowAsync(
      () => this.studentExamAttemptsService.upsert(payload),
      `Failed to handle POST /student-exam-attempts for ${payload.studentId}`,
    );
  }
}
