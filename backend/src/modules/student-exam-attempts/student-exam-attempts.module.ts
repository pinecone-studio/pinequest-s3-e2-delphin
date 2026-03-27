import { Module } from '@nestjs/common';
import { StudentExamAttemptsController } from './student-exam-attempts.controller';
import { StudentExamAttemptsService } from './student-exam-attempts.service';

@Module({
  controllers: [StudentExamAttemptsController],
  providers: [StudentExamAttemptsService],
  exports: [StudentExamAttemptsService],
})
export class StudentExamAttemptsModule {}
