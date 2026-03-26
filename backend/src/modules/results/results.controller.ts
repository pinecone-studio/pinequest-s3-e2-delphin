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
  type CreateResultDto,
  type Result,
  ResultsService,
  type UpdateResultDto,
} from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  async findAll(): Promise<Result[]> {
    return executeOrRethrowAsync(
      () => this.resultsService.findAll(),
      'Failed to handle GET /results',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Result> {
    return executeOrRethrowAsync(
      () => this.resultsService.findOne(id),
      `Failed to handle GET /results/${id}`,
    );
  }

  @Post()
  async create(@Body() payload: CreateResultDto): Promise<Result> {
    return executeOrRethrowAsync(
      () => this.resultsService.create(payload),
      `Failed to handle POST /results for payload id ${payload.id}`,
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateResultDto): Promise<Result> {
    return executeOrRethrowAsync(
      () => this.resultsService.update(id, payload),
      `Failed to handle PATCH /results/${id}`,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Result> {
    return executeOrRethrowAsync(
      () => this.resultsService.remove(id),
      `Failed to handle DELETE /results/${id}`,
    );
  }
}
