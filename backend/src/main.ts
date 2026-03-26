import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionLoggingFilter } from './common/http-exception.filter';
import { rateLimitMiddleware } from './common/rate-limit.middleware';
import { requestLogger } from './common/request-logger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(requestLogger);
  app.use(rateLimitMiddleware);
  app.useGlobalFilters(new HttpExceptionLoggingFilter());
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
