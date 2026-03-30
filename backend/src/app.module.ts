import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { DatabaseModule } from './database/database.module';
import { ExamsModule } from './modules/exams/exams.module';
import { QuestionBankModule } from './modules/question-bank/question-bank.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ResultsModule } from './modules/results/results.module';
import { StudentExamAttemptsModule } from './modules/student-exam-attempts/student-exam-attempts.module';
import { StudentExamResultsModule } from './modules/student-exam-results/student-exam-results.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    ExamsModule,
    QuestionBankModule,
    AssessmentsModule,
    AssignmentsModule,
    SubmissionsModule,
    ResultsModule,
    StudentExamAttemptsModule,
    StudentExamResultsModule,
    ReportsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
