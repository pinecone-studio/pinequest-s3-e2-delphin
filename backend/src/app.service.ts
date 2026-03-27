import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { UploadsService } from './modules/uploads/uploads.service';

@Injectable()
export class AppService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly uploadsService: UploadsService,
  ) {}

  getOverview() {
    return {
      name: 'PineQuest LMS API',
      version: 'hackathon-scaffold',
      frontend: 'Next.js',
      backend: 'NestJS',
      modules: [
        'auth',
        'users',
        'courses',
        'exams',
        'assessments',
        'assignments',
        'submissions',
        'results',
        'reports',
      ],
    };
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'pinequest-backend',
      databaseConfigured: this.databaseService.isConfigured(),
      uploadMetadataPersistence: this.databaseService.isConfigured() ? 'd1' : 'local-file',
      storageConfigured: Boolean(
        process.env.CLOUDFLARE_R2_BUCKET_NAME &&
          process.env.CLOUDFLARE_R2_ENDPOINT &&
          process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
          process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      ),
    };
  }

  async getReady() {
    const [database, storage] = await Promise.all([
      this.databaseService.checkHealth(),
      this.uploadsService.checkStorageHealth(),
    ]);

    const ready = database.ok && storage.ok;

    const payload = {
      status: ready ? 'ready' : 'not-ready',
      timestamp: new Date().toISOString(),
      service: 'pinequest-backend',
      message: ready
        ? 'Сервер бэлэн байна.'
        : 'Сервер бүрэн бэлэн биш байна. Cloudflare D1 эсвэл R2 үйлчилгээ, эсвэл орчны хувьсагчийн тохиргоог шалгана уу.',
      checks: {
        database,
        storage,
      },
    };

    if (!ready) {
      throw new ServiceUnavailableException(payload);
    }

    return payload;
  }
}
