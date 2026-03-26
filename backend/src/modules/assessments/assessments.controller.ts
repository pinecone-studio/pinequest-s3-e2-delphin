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
  type Assessment,
  AssessmentsService,
  type CreateAssessmentDto,
  type UpdateAssessmentDto,
} from './assessments.service';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get()
  async findAll(): Promise<Assessment[]> {
    return executeOrRethrowAsync(
      () => this.assessmentsService.findAll(),
      'Failed to handle GET /assessments',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Assessment> {
    return executeOrRethrowAsync(
      () => this.assessmentsService.findOne(id),
      `Failed to handle GET /assessments/${id}`,
    );
  }

  @Post()
  async create(@Body() payload: CreateAssessmentDto): Promise<Assessment> {
    return executeOrRethrowAsync(
      () => this.assessmentsService.create(payload),
      `Failed to handle POST /assessments for payload id ${payload.id}`,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateAssessmentDto,
  ): Promise<Assessment> {
    return executeOrRethrowAsync(
      () => this.assessmentsService.update(id, payload),
      `Failed to handle PATCH /assessments/${id}`,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Assessment> {
    return executeOrRethrowAsync(
      () => this.assessmentsService.remove(id),
      `Failed to handle DELETE /assessments/${id}`,
    );
  }
}
