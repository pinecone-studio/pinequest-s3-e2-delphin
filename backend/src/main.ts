import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionLoggingFilter } from './common/http-exception.filter';
import { rateLimitMiddleware } from './common/rate-limit.middleware';
import { requestLogger } from './common/request-logger';
import { AppModule } from './app.module';

const backendEnvPath = resolve(process.cwd(), 'backend', '.env');
const rootEnvPath = resolve(process.cwd(), '.env');
if (existsSync(backendEnvPath)) {
  config({ path: backendEnvPath });
} else if (existsSync(rootEnvPath)) {
  config({ path: rootEnvPath });
} else {
  config();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(requestLogger);
  app.use(rateLimitMiddleware);
  app.useGlobalFilters(new HttpExceptionLoggingFilter());
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
void bootstrap();
