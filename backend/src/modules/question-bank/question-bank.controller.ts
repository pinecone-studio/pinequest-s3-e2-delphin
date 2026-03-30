import { Body, Controller, Get, Post } from '@nestjs/common';
import { executeOrRethrowAsync } from '../../common/error-handling';
import { QuestionBankService } from './question-bank.service';
import type {
  CreateQuestionBankCategoryDto,
  CreateQuestionBankQuestionSetDto,
  QuestionBankCategory,
  QuestionBankTopic,
} from './question-bank.types';

@Controller('question-bank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Get()
  async findAll(): Promise<QuestionBankCategory[]> {
    return executeOrRethrowAsync(
      () => this.questionBankService.findAll(),
      'Failed to handle GET /question-bank',
    );
  }

  @Post('categories')
  async createCategory(
    @Body() payload: CreateQuestionBankCategoryDto,
  ): Promise<QuestionBankCategory> {
    return executeOrRethrowAsync(
      () => this.questionBankService.createCategory(payload),
      `Failed to handle POST /question-bank/categories for ${payload.name}`,
    );
  }

  @Post('question-sets')
  async createQuestionSet(
    @Body() payload: CreateQuestionBankQuestionSetDto,
  ): Promise<QuestionBankTopic> {
    return executeOrRethrowAsync(
      () => this.questionBankService.createQuestionSet(payload),
      `Failed to handle POST /question-bank/question-sets for topic ${payload.topicName}`,
    );
  }
}
