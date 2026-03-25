import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
