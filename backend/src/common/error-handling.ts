import { HttpException, InternalServerErrorException } from '@nestjs/common';

export function rethrowAsInternal(
  error: unknown,
  fallbackMessage: string,
): never {
  if (error instanceof HttpException) {
    throw error;
  }

  throw new InternalServerErrorException(
    {
      message: fallbackMessage,
      error: 'Internal Server Error',
    },
    {
      cause: error,
    },
  );
}

export function executeOrRethrow<T>(
  action: () => T,
  fallbackMessage: string,
): T {
  try {
    return action();
  } catch (error) {
    rethrowAsInternal(error, fallbackMessage);
  }
}

export async function executeOrRethrowAsync<T>(
  action: () => Promise<T>,
  fallbackMessage: string,
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    rethrowAsInternal(error, fallbackMessage);
  }
}
