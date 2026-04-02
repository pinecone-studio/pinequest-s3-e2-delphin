import { HttpException, HttpStatus } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

type RequestWithRateLimit = Request & {
  requestId?: string;
};

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const RATE_LIMIT_BUCKETS = new Map<string, RateLimitEntry>();

const GENERAL_WINDOW_MS = 60_000;
const GENERAL_MAX_REQUESTS = 120;
const STUDENT_EXAM_READ_WINDOW_MS = 60_000;
const STUDENT_EXAM_READ_MAX_REQUESTS = 1_500;
const WRITE_WINDOW_MS = 60_000;
const WRITE_MAX_REQUESTS = 30;
const STUDENT_EXAM_WRITE_WINDOW_MS = 60_000;
const STUDENT_EXAM_WRITE_MAX_REQUESTS = 800;
const UPLOAD_WINDOW_MS = 60_000;
const UPLOAD_MAX_REQUESTS = 10;

function getClientKey(request: Request) {
  const forwardedFor = request.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.ip || request.socket.remoteAddress || 'unknown';
}

function isReadRequest(request: Request) {
  return (
    request.method === 'GET' ||
    request.method === 'HEAD' ||
    request.method === 'OPTIONS'
  );
}

function isStudentExamReadRequest(request: Request) {
  if (!isReadRequest(request)) {
    return false;
  }

  return (
    request.path.startsWith('/api/exams') ||
    request.path.startsWith('/api/student-exam-attempts') ||
    request.path.startsWith('/api/student-exam-results')
  );
}

function getBucketConfig(request: Request) {
  if (isStudentExamReadRequest(request)) {
    return {
      windowMs: STUDENT_EXAM_READ_WINDOW_MS,
      maxRequests: STUDENT_EXAM_READ_MAX_REQUESTS,
      scope: 'student-exam-read',
    };
  }

  if (
    request.method === 'POST' &&
    (request.path.startsWith('/api/student-exam-attempts') ||
      request.path.startsWith('/api/student-exam-results'))
  ) {
    return {
      windowMs: STUDENT_EXAM_WRITE_WINDOW_MS,
      maxRequests: STUDENT_EXAM_WRITE_MAX_REQUESTS,
      scope: 'student-exam-write',
    };
  }

  if (request.path.startsWith('/api/uploads') && request.method === 'POST') {
    return {
      windowMs: UPLOAD_WINDOW_MS,
      maxRequests: UPLOAD_MAX_REQUESTS,
      scope: 'upload',
    };
  }

  if (!isReadRequest(request)) {
    return {
      windowMs: WRITE_WINDOW_MS,
      maxRequests: WRITE_MAX_REQUESTS,
      scope: 'write',
    };
  }

  return {
    windowMs: GENERAL_WINDOW_MS,
    maxRequests: GENERAL_MAX_REQUESTS,
    scope: 'general',
  };
}

export function rateLimitMiddleware(
  request: RequestWithRateLimit,
  response: Response,
  next: NextFunction,
) {
  if (request.path === '/api/health' || request.path === '/api/ready') {
    next();
    return;
  }

  const clientKey = getClientKey(request);
  const bucket = getBucketConfig(request);
  const now = Date.now();
  const cacheKey = `${bucket.scope}:${clientKey}`;
  const current = RATE_LIMIT_BUCKETS.get(cacheKey);

  if (!current || current.expiresAt <= now) {
    RATE_LIMIT_BUCKETS.set(cacheKey, {
      count: 1,
      expiresAt: now + bucket.windowMs,
    });

    response.setHeader('X-RateLimit-Limit', bucket.maxRequests.toString());
    response.setHeader(
      'X-RateLimit-Remaining',
      Math.max(bucket.maxRequests - 1, 0).toString(),
    );
    next();
    return;
  }

  current.count += 1;
  RATE_LIMIT_BUCKETS.set(cacheKey, current);

  const remaining = Math.max(bucket.maxRequests - current.count, 0);
  response.setHeader('X-RateLimit-Limit', bucket.maxRequests.toString());
  response.setHeader('X-RateLimit-Remaining', remaining.toString());
  response.setHeader(
    'Retry-After',
    Math.ceil((current.expiresAt - now) / 1000).toString(),
  );

  if (current.count > bucket.maxRequests) {
    next(
      new HttpException(
        'Too many requests. Please slow down and try again shortly.',
        HttpStatus.TOO_MANY_REQUESTS,
      ),
    );
    return;
  }

  next();
}
