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
  type Course,
  CoursesService,
  type CreateCourseDto,
  type UpdateCourseDto,
} from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(): Promise<Course[]> {
    return executeOrRethrowAsync(
      () => this.coursesService.findAll(),
      'Failed to handle GET /courses',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Course> {
    return executeOrRethrowAsync(
      () => this.coursesService.findOne(id),
      `Failed to handle GET /courses/${id}`,
    );
  }

  @Post()
  async create(@Body() payload: CreateCourseDto): Promise<Course> {
    return executeOrRethrowAsync(
      () => this.coursesService.create(payload),
      `Failed to handle POST /courses for payload id ${payload.id}`,
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateCourseDto): Promise<Course> {
    return executeOrRethrowAsync(
      () => this.coursesService.update(id, payload),
      `Failed to handle PATCH /courses/${id}`,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Course> {
    return executeOrRethrowAsync(
      () => this.coursesService.remove(id),
      `Failed to handle DELETE /courses/${id}`,
    );
  }
}
