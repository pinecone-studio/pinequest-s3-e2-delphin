import { Module } from '@nestjs/common';
import { StudentExamResultsController } from './student-exam-results.controller';
import { StudentExamResultsService } from './student-exam-results.service';

@Module({
  controllers: [StudentExamResultsController],
  providers: [StudentExamResultsService],
  exports: [StudentExamResultsService],
})
export class StudentExamResultsModule {}
