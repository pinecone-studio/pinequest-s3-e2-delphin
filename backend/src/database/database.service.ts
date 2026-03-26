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
        error: error instanceof Error ? error.message : 'Unknown D1 health check failure',
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
      },
    );

    if (!response.ok) {
      throw new ServiceUnavailableException(
        `Cloudflare D1 request failed with status ${response.status}`,
      );
    }

    const payload = (await response.json()) as D1ApiResponse<T>;
    if (!payload.success) {
      const message =
        payload.errors?.map((entry) => entry.message).filter(Boolean).join(' ') ||
        'Cloudflare D1 rejected the request';
      throw new ServiceUnavailableException(message);
    }

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
      throw new ServiceUnavailableException(message);
    }

    return statement;
  }
}
