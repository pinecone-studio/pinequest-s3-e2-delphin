import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { parsePaginationParams } from '../../common/pagination';
import { executeOrRethrowAsync } from '../../common/error-handling';
import {
  type PaginatedUploadRecords,
  type UploadedFilePayload,
  UploadsService,
} from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async upload(
    @UploadedFile() file: UploadedFilePayload | undefined,
    @Query('folder') folder?: string,
  ): Promise<Awaited<ReturnType<UploadsService['uploadFile']>>> {
    return executeOrRethrowAsync(
      async () => {
        if (!file) {
          throw new BadRequestException(
            'Upload a multipart/form-data request with a file field named "file"',
          );
        }

        return await this.uploadsService.uploadFile(file, folder);
      },
      `Failed to upload file ${file?.originalname ?? 'unknown-file'}`,
    );
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('folder') folder?: string,
  ): Promise<PaginatedUploadRecords> {
    return executeOrRethrowAsync(() => {
      const pagination = parsePaginationParams(page, limit);

      return this.uploadsService.findAllUploads(
        pagination.page,
        pagination.limit,
        folder,
      );
    }, 'Failed to list upload metadata records');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return executeOrRethrowAsync(
      () => this.uploadsService.findUploadById(id),
      `Failed to load upload ${id}`,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return executeOrRethrowAsync(
      () => this.uploadsService.removeUpload(id),
      `Failed to delete upload ${id}`,
    );
  }

  @Get(':id/content')
  async getContent(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    return executeOrRethrowAsync(async () => {
      const { file, body } = await this.uploadsService.downloadUpload(id);

      response.setHeader('Content-Type', file.contentType);
      response.setHeader('Content-Length', file.size.toString());
      response.setHeader(
        'Content-Disposition',
        `inline; filename="${file.originalName.replace(/"/g, '')}"`,
      );

      return new StreamableFile(body);
    }, `Failed to stream content for upload ${id}`);
  }
}
