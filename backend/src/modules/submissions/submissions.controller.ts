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
  type CreateSubmissionDto,
  type Submission,
  SubmissionsService,
  type UpdateSubmissionDto,
} from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  async findAll(): Promise<Submission[]> {
    return executeOrRethrowAsync(
      () => this.submissionsService.findAll(),
      'Failed to handle GET /submissions',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Submission> {
    return executeOrRethrowAsync(
      () => this.submissionsService.findOne(id),
      `Failed to handle GET /submissions/${id}`,
    );
  }

  @Post()
  async create(@Body() payload: CreateSubmissionDto): Promise<Submission> {
    return executeOrRethrowAsync(
      () => this.submissionsService.create(payload),
      `Failed to handle POST /submissions for payload id ${payload.id}`,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateSubmissionDto,
  ): Promise<Submission> {
    return executeOrRethrowAsync(
      () => this.submissionsService.update(id, payload),
      `Failed to handle PATCH /submissions/${id}`,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Submission> {
    return executeOrRethrowAsync(
      () => this.submissionsService.remove(id),
      `Failed to handle DELETE /submissions/${id}`,
    );
  }
}
