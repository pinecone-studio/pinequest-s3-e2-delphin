import {
  BadRequestException,
  GatewayTimeoutException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  executeOrRethrowAsync,
  rethrowAsInternal,
} from '../../common/error-handling';
import { DatabaseService } from '../../database/database.service';

export type UploadedFilePayload = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export type UploadRecord = {
  id: string;
  key: string;
  bucket: string;
  folder: string;
  originalName: string;
  contentType: string;
  size: number;
  uploadedAt: string;
  publicUrl: string | null;
};

export type PaginatedUploadRecords = {
  items: UploadRecord[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

@Injectable()
export class UploadsService {
  private static readonly STORAGE_TIMEOUT_MS = 8000;
  private static readonly STORAGE_MAX_RETRIES = 2;
  private s3Client: S3Client | null = null;
  private readonly uploadRecords = new Map<string, UploadRecord>();
  private readonly localMetadataPath = resolve(
    process.cwd(),
    '.data',
    'upload-records.json',
  );
  private localMetadataLoaded = false;

  constructor(private readonly databaseService: DatabaseService) {}

  private async ensureLocalRecordsLoaded(): Promise<void> {
    if (this.localMetadataLoaded || this.databaseService.isConfigured()) {
      return;
    }

    try {
      const rawContent = await readFile(this.localMetadataPath, 'utf8');
      const records = JSON.parse(rawContent) as UploadRecord[];

      this.uploadRecords.clear();
      for (const record of records) {
        this.uploadRecords.set(record.id, record);
      }

      this.localMetadataLoaded = true;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code === 'ENOENT') {
        this.localMetadataLoaded = true;
        return;
      }

      rethrowAsInternal(
        error,
        `Failed to load local upload metadata from ${this.localMetadataPath}`,
      );
    }
  }

  private async persistLocalRecords(): Promise<void> {
    if (this.databaseService.isConfigured()) {
      return;
    }

    try {
      await mkdir(dirname(this.localMetadataPath), { recursive: true });
      await writeFile(
        this.localMetadataPath,
        JSON.stringify([...this.uploadRecords.values()], null, 2),
        'utf8',
      );
    } catch (error) {
      rethrowAsInternal(
        error,
        `Failed to persist local upload metadata to ${this.localMetadataPath}`,
      );
    }
  }

  private getBucketName(): string {
    const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    if (!bucket) {
      throw new InternalServerErrorException(
        'CLOUDFLARE_R2_BUCKET_NAME is not configured',
      );
    }
    return bucket;
  }

  private getClient(): S3Client {
    if (this.s3Client) {
      return this.s3Client;
    }

    const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new InternalServerErrorException(
        'Cloudflare R2 credentials are not fully configured',
      );
    }

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    return this.s3Client;
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
  }

  private buildObjectKey(originalName: string, folder?: string): string {
    const safeName = this.sanitizeFileName(originalName);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const randomSuffix = Math.random().toString(36).slice(2, 10);
    const baseFolder = folder?.trim().replace(/^\/+|\/+$/g, '') || 'uploads';

    return `${baseFolder}/${timestamp}-${randomSuffix}-${safeName}`;
  }

  private buildPublicUrl(key: string): string | null {
    const publicBase = process.env.CLOUDFLARE_R2_PUBLIC_URL?.trim();

    if (!publicBase) {
      return null;
    }

    return `${publicBase.replace(/\/+$/g, '')}/${key}`;
  }

  private isRetryableStorageError(error: unknown) {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const candidate = error as {
      name?: string;
      message?: string;
      $metadata?: { httpStatusCode?: number };
    };

    if (candidate.name === 'AbortError' || candidate.name === 'TimeoutError') {
      return true;
    }

    if (
      candidate.$metadata?.httpStatusCode &&
      candidate.$metadata.httpStatusCode >= 500
    ) {
      return true;
    }

    const message = candidate.message?.toLowerCase() ?? '';
    return (
      message.includes('timeout') ||
      message.includes('timed out') ||
      message.includes('socket') ||
      message.includes('econnreset') ||
      message.includes('service unavailable')
    );
  }

  private async sendStorageCommand<T>(
    command:
      | DeleteObjectCommand
      | GetObjectCommand
      | HeadBucketCommand
      | PutObjectCommand,
    operationName: string,
  ): Promise<T> {
    let lastError: unknown;

    for (
      let attempt = 0;
      attempt <= UploadsService.STORAGE_MAX_RETRIES;
      attempt += 1
    ) {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        UploadsService.STORAGE_TIMEOUT_MS,
      );

      try {
        return (await this.getClient().send(command, {
          abortSignal: controller.signal,
        })) as T;
      } catch (error) {
        lastError = error;

        if (
          !this.isRetryableStorageError(error) ||
          attempt === UploadsService.STORAGE_MAX_RETRIES
        ) {
          break;
        }
      } finally {
        clearTimeout(timeout);
      }
    }

    const message =
      lastError instanceof Error
        ? lastError.message
        : `Unknown ${operationName} failure`;

    if (
      lastError &&
      typeof lastError === 'object' &&
      'name' in lastError &&
      lastError.name === 'AbortError'
    ) {
      throw new GatewayTimeoutException(`${operationName} timed out`);
    }

    throw new ServiceUnavailableException(
      `${operationName} failed: ${message}`,
    );
  }

  private async saveUploadRecord(record: UploadRecord): Promise<void> {
    try {
      await this.ensureLocalRecordsLoaded();
      this.uploadRecords.set(record.id, record);

      if (!this.databaseService.isConfigured()) {
        await this.persistLocalRecords();
        return;
      }

      await this.databaseService.execute(
        `INSERT INTO uploaded_files (
          id, bucket, key, folder, original_name, content_type, size, uploaded_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.id,
          record.bucket,
          record.key,
          record.folder,
          record.originalName,
          record.contentType,
          record.size,
          record.uploadedAt,
        ],
      );
    } catch (error) {
      rethrowAsInternal(
        error,
        `Failed to save upload metadata for file ${record.originalName}`,
      );
    }
  }

  private async findPersistedUploadRecord(
    id: string,
  ): Promise<UploadRecord | null> {
    try {
      await this.ensureLocalRecordsLoaded();
      const cachedRecord = this.uploadRecords.get(id);
      if (cachedRecord) {
        return cachedRecord;
      }

      if (!this.databaseService.isConfigured()) {
        return null;
      }

      const record = await this.databaseService.queryFirst<{
        id: string;
        bucket: string;
        key: string;
        folder: string;
        originalName: string;
        contentType: string;
        size: number;
        uploadedAt: string;
      }>(
        `SELECT id, bucket, key, folder, original_name as originalName,
         content_type as contentType, size, uploaded_at as uploadedAt
         FROM uploaded_files
         WHERE id = ?
         LIMIT 1`,
        [id],
      );

      if (!record) {
        return null;
      }

      const hydratedRecord: UploadRecord = {
        id: record.id,
        bucket: record.bucket,
        key: record.key,
        folder: record.folder,
        originalName: record.originalName,
        contentType: record.contentType,
        size: record.size,
        uploadedAt: record.uploadedAt,
        publicUrl: this.buildPublicUrl(record.key),
      };

      this.uploadRecords.set(hydratedRecord.id, hydratedRecord);
      return hydratedRecord;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load upload metadata for id ${id}`);
    }
  }

  private normalizeFolder(folder?: string): string {
    return folder?.trim().replace(/^\/+|\/+$/g, '') || 'uploads';
  }

  async checkStorageHealth(): Promise<{
    configured: boolean;
    ok: boolean;
    latencyMs: number | null;
    error?: string;
  }> {
    const bucketConfigured = Boolean(process.env.CLOUDFLARE_R2_BUCKET_NAME);
    const credentialConfigured = Boolean(
      process.env.CLOUDFLARE_R2_ENDPOINT &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    );

    if (!bucketConfigured || !credentialConfigured) {
      return {
        configured: false,
        ok: false,
        latencyMs: null,
        error: 'Cloudflare R2 credentials are not fully configured',
      };
    }

    const startedAt = Date.now();

    try {
      await this.sendStorageCommand(
        new HeadBucketCommand({
          Bucket: this.getBucketName(),
        }),
        'R2 health check',
      );

      return {
        configured: true,
        ok: true,
        latencyMs: Date.now() - startedAt,
      };
    } catch (error) {
      return {
        configured: true,
        ok: false,
        latencyMs: Date.now() - startedAt,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown R2 health check failure',
      };
    }
  }

  async uploadFile(
    file: UploadedFilePayload | undefined,
    folder?: string,
  ): Promise<UploadRecord> {
    return executeOrRethrowAsync(
      async () => {
        if (!file) {
          throw new BadRequestException('A file is required');
        }

        if (!file.buffer?.length) {
          throw new BadRequestException('Uploaded file is empty');
        }

        const bucket = this.getBucketName();
        const normalizedFolder = this.normalizeFolder(folder);
        const key = this.buildObjectKey(file.originalname, normalizedFolder);

        await this.sendStorageCommand(
          new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype || 'application/octet-stream',
          }),
          'R2 upload',
        );

        const uploadRecord: UploadRecord = {
          id: crypto.randomUUID(),
          key,
          bucket,
          folder: normalizedFolder,
          originalName: file.originalname,
          contentType: file.mimetype || 'application/octet-stream',
          size: file.size,
          uploadedAt: new Date().toISOString(),
          publicUrl: this.buildPublicUrl(key),
        };

        await this.saveUploadRecord(uploadRecord);

        return uploadRecord;
      },
      `Failed to upload file ${file?.originalname ?? 'unknown-file'} to R2`,
    );
  }

  async findAllUploads(
    page: number,
    limit: number,
    folder?: string,
  ): Promise<PaginatedUploadRecords> {
    try {
      await this.ensureLocalRecordsLoaded();
      const normalizedFolder = folder
        ? this.normalizeFolder(folder)
        : undefined;
      if (!this.databaseService.isConfigured()) {
        const items = [...this.uploadRecords.values()]
          .filter((record) =>
            normalizedFolder ? record.folder === normalizedFolder : true,
          )
          .sort((left, right) =>
            right.uploadedAt.localeCompare(left.uploadedAt),
          );
        const start = (page - 1) * limit;
        const pagedItems = items.slice(start, start + limit);

        return {
          items: pagedItems,
          page,
          limit,
          total: items.length,
          totalPages: Math.ceil(items.length / limit),
        };
      }

      const records = await this.databaseService.query<{
        id: string;
        bucket: string;
        key: string;
        folder: string;
        originalName: string;
        contentType: string;
        size: number;
        uploadedAt: string;
      }>(
        `SELECT id, bucket, key, folder, original_name as originalName,
         content_type as contentType, size, uploaded_at as uploadedAt
         FROM uploaded_files`,
      );

      const items = records
        .map((record) => ({
          id: record.id,
          bucket: record.bucket,
          key: record.key,
          folder: record.folder,
          originalName: record.originalName,
          contentType: record.contentType,
          size: record.size,
          uploadedAt: record.uploadedAt,
          publicUrl: this.buildPublicUrl(record.key),
        }))
        .filter((record) =>
          normalizedFolder ? record.folder === normalizedFolder : true,
        )
        .sort((left, right) => right.uploadedAt.localeCompare(left.uploadedAt));

      const start = (page - 1) * limit;
      const pagedItems = items.slice(start, start + limit);

      return {
        items: pagedItems,
        page,
        limit,
        total: items.length,
        totalPages: Math.ceil(items.length / limit),
      };
    } catch (error) {
      rethrowAsInternal(error, 'Failed to list upload metadata records');
    }
  }

  async findUploadById(id: string): Promise<UploadRecord> {
    try {
      const record = await this.findPersistedUploadRecord(id);
      if (!record) {
        throw new NotFoundException(`Upload ${id} not found`);
      }

      return record;
    } catch (error) {
      rethrowAsInternal(error, `Failed to load upload ${id}`);
    }
  }

  async removeUpload(id: string): Promise<UploadRecord> {
    try {
      const record = await this.findUploadById(id);

      await this.sendStorageCommand(
        new DeleteObjectCommand({
          Bucket: record.bucket,
          Key: record.key,
        }),
        'R2 delete',
      );

      await this.ensureLocalRecordsLoaded();
      this.uploadRecords.delete(id);

      if (!this.databaseService.isConfigured()) {
        await this.persistLocalRecords();
        return record;
      }

      await this.databaseService.execute(
        'DELETE FROM uploaded_files WHERE id = ?',
        [id],
      );

      return record;
    } catch (error) {
      rethrowAsInternal(error, `Failed to delete upload ${id}`);
    }
  }

  async downloadUpload(id: string): Promise<{
    file: UploadRecord;
    body: Buffer;
  }> {
    try {
      const record = await this.findUploadById(id);
      const response = await this.sendStorageCommand<{
        Body?: { transformToByteArray: () => Promise<Uint8Array> };
      }>(
        new GetObjectCommand({
          Bucket: record.bucket,
          Key: record.key,
        }),
        'R2 download',
      );

      if (!response.Body) {
        throw new NotFoundException(`Upload ${id} has no content in R2`);
      }

      const bytes = await response.Body.transformToByteArray();

      return {
        file: record,
        body: Buffer.from(bytes),
      };
    } catch (error) {
      rethrowAsInternal(error, `Failed to download upload ${id} from R2`);
    }
  }
}
