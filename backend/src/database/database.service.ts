import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';

type D1Value = string | number | boolean | null;

type D1StatementResult<T> = {
  results?: T[];
  success?: boolean;
  meta?: Record<string, unknown>;
  errors?: Array<{ message?: string }>;
};

type D1ApiResponse<T> = {
  success?: boolean;
  errors?: Array<{ message?: string }>;
  result?: Array<D1StatementResult<T>>;
};

const TRANSIENT_STATUSES = new Set([429, 502, 503, 504]);
const RETRY_DELAYS_MS = [250, 750];
const REQUEST_TIMEOUT_MS = 8000;

function wait(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

async function readD1ErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      errors?: Array<{ message?: string }>;
      messages?: Array<{ message?: string }>;
      result?: Array<{ errors?: Array<{ message?: string }> }>;
    };

    const topLevelMessage =
      payload.errors
        ?.map((entry) => entry.message)
        .filter(Boolean)
        .join(' ') ||
      payload.messages
        ?.map((entry) => entry.message)
        .filter(Boolean)
        .join(' ');

    if (topLevelMessage) {
      return topLevelMessage;
    }

    const statementMessage = payload.result
      ?.flatMap((statement) => statement.errors ?? [])
      .map((entry) => entry.message)
      .filter(Boolean)
      .join(' ');

    if (statementMessage) {
      return statementMessage;
    }
  } catch {
    // Ignore non-JSON responses.
  }

  try {
    const text = await response.text();
    if (text.trim()) {
      return text.trim();
    }
  } catch {
    // Ignore unreadable bodies.
  }

  return '';
}

@Injectable()
export class DatabaseService {
  private getConfig() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
    const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();
    const token = process.env.CLOUDFLARE_D1_TOKEN?.trim();

    return {
      accountId,
      databaseId,
      token,
      isConfigured: Boolean(accountId && databaseId && token),
    };
  }

  isConfigured() {
    return this.getConfig().isConfigured;
  }

  async query<T>(sql: string, params: D1Value[] = []): Promise<T[]> {
    const statement = await this.executeStatement<T>(sql, params);
    return statement.results ?? [];
  }

  async queryFirst<T>(sql: string, params: D1Value[] = []): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results[0] ?? null;
  }

  async execute(sql: string, params: D1Value[] = []): Promise<void> {
    await this.executeStatement(sql, params);
  }

  async checkHealth(): Promise<{
    configured: boolean;
    ok: boolean;
    latencyMs: number | null;
    mode: 'd1' | 'local-fallback';
    error?: string;
  }> {
    if (!this.isConfigured()) {
      return {
        configured: false,
        ok: true,
        latencyMs: null,
        mode: 'local-fallback',
      };
    }

    const startedAt = Date.now();

    try {
      await this.query('SELECT 1 as ok');

      return {
        configured: true,
        ok: true,
        latencyMs: Date.now() - startedAt,
        mode: 'd1',
      };
    } catch (error) {
      return {
        configured: true,
        ok: false,
        latencyMs: Date.now() - startedAt,
        mode: 'd1',
        error:
          error instanceof Error
            ? error.message
            : 'Unknown D1 health check failure',
      };
    }
  }

  private async executeStatement<T>(
    sql: string,
    params: D1Value[] = [],
  ): Promise<D1StatementResult<T>> {
    const { accountId, databaseId, token, isConfigured } = this.getConfig();
    if (!isConfigured || !accountId || !databaseId || !token) {
      throw new InternalServerErrorException(
        'Cloudflare D1 credentials are not fully configured',
      );
    }

    let lastError: ServiceUnavailableException | null = null;

    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sql,
              params,
            }),
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          const detail = await readD1ErrorMessage(response);
          const transientMessage = detail
            ? `Cloudflare D1 request failed with status ${response.status}: ${detail}`
            : `Cloudflare D1 request failed with status ${response.status}`;
          lastError = new ServiceUnavailableException(transientMessage);

          if (
            !TRANSIENT_STATUSES.has(response.status) ||
            attempt === RETRY_DELAYS_MS.length
          ) {
            throw lastError;
          }
        } else {
          const payload = (await response.json()) as D1ApiResponse<T>;
          if (!payload.success) {
            const message =
              payload.errors
                ?.map((entry) => entry.message)
                .filter(Boolean)
                .join(' ') || 'Cloudflare D1 rejected the request';
            lastError = new ServiceUnavailableException(message);

            if (attempt === RETRY_DELAYS_MS.length) {
              throw lastError;
            }
          } else {
            const [statement] = payload.result ?? [];
            if (!statement) {
              return {};
            }

            if (statement.success === false) {
              const message =
                statement.errors
                  ?.map((entry) => entry.message)
                  .filter(Boolean)
                  .join(' ') || 'Cloudflare D1 statement failed';
              lastError = new ServiceUnavailableException(message);

              if (attempt === RETRY_DELAYS_MS.length) {
                throw lastError;
              }
            } else {
              return statement;
            }
          }
        }
      } catch (error) {
        if (error instanceof ServiceUnavailableException) {
          lastError = error;
        } else {
          const message =
            error instanceof Error && error.name === 'AbortError'
              ? 'Cloudflare D1 request timed out'
              : error instanceof Error
                ? error.message
                : 'Cloudflare D1 request failed';
          lastError = new ServiceUnavailableException(message);
        }

        if (attempt === RETRY_DELAYS_MS.length) {
          throw lastError;
        }
      } finally {
        clearTimeout(timeout);
      }

      await wait(RETRY_DELAYS_MS[attempt]);
    }

    throw (
      lastError ??
      new ServiceUnavailableException('Cloudflare D1 request failed')
    );
  }
}
