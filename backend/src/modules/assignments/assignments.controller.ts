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
  type Assignment,
  AssignmentsService,
  type CreateAssignmentDto,
  type UpdateAssignmentDto,
} from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async findAll(): Promise<Assignment[]> {
    return executeOrRethrowAsync(
      () => this.assignmentsService.findAll(),
      'Failed to handle GET /assignments',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Assignment> {
    return executeOrRethrowAsync(
      () => this.assignmentsService.findOne(id),
      `Failed to handle GET /assignments/${id}`,
    );
  }

  @Post()
  async create(@Body() payload: CreateAssignmentDto): Promise<Assignment> {
    return executeOrRethrowAsync(
      () => this.assignmentsService.create(payload),
      `Failed to handle POST /assignments for payload id ${payload.id}`,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateAssignmentDto,
  ): Promise<Assignment> {
    return executeOrRethrowAsync(
      () => this.assignmentsService.update(id, payload),
      `Failed to handle PATCH /assignments/${id}`,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Assignment> {
    return executeOrRethrowAsync(
      () => this.assignmentsService.remove(id),
      `Failed to handle DELETE /assignments/${id}`,
    );
  }
}
