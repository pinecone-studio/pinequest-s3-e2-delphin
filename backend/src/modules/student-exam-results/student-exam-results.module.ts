import { Module } from '@nestjs/common';
import { ExamsModule } from '../exams/exams.module';
import { StudentExamResultsController } from './student-exam-results.controller';
import { StudentExamGradingService } from './student-exam-grading.service';
import { StudentExamResultsService } from './student-exam-results.service';

@Module({
  imports: [ExamsModule],
  controllers: [StudentExamResultsController],
  providers: [StudentExamResultsService, StudentExamGradingService],
  exports: [StudentExamResultsService],
})
export class StudentExamResultsModule {}
