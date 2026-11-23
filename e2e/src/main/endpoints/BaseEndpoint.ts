import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ApiLog } from '@support/ApiLog';

export type RequestOptions = {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
};

/**
 * Base for every endpoint class (one class per page/area, like pages/).
 * Rules (checked by conventions-check):
 * - One HTTP call per method (`create`, `getById`, `delete`…), and it returns the raw `APIResponse`.
 *   No `expect` here: what to check (status, body) is decided by the step.
 * - No `page`, no locators, no test data: payloads come from entities/ builders.
 * - Base URL and auth come from the `api` fixture (API_BASE_URL, API_TOKEN or the UI session).
 * Endpoints exist to PREPARE state (and clean it up) only for phases already validated by UI in another scenario
 * (`uiCoveredBy`). The action and the assertion of a case always go through the UI.
 */
export abstract class BaseEndpoint {
  /** Path of this area relative to the API base URL, e.g. '/api/households'. */
  protected abstract readonly basePath: string;

  constructor(
    protected readonly request: APIRequestContext,
    private readonly log: ApiLog,
  ) {}

  protected get(path = '', opts: RequestOptions = {}): Promise<APIResponse> {
    return this.send('GET', path, undefined, opts);
  }

  protected post(path: string, data: unknown, opts: RequestOptions = {}): Promise<APIResponse> {
    return this.send('POST', path, data, opts);
  }

  protected put(path: string, data: unknown, opts: RequestOptions = {}): Promise<APIResponse> {
    return this.send('PUT', path, data, opts);
  }

  protected patch(path: string, data: unknown, opts: RequestOptions = {}): Promise<APIResponse> {
    return this.send('PATCH', path, data, opts);
  }

  protected delete(path = '', opts: RequestOptions = {}): Promise<APIResponse> {
    return this.send('DELETE', path, undefined, opts);
  }

  private async send(method: string, path: string, data: unknown, opts: RequestOptions): Promise<APIResponse> {
    const url = `${this.basePath}${path}`;
    const res = await this.request.fetch(url, { method, data, params: opts.params, headers: opts.headers });
    await this.log.record(method, url, data, res);
    return res;
  }
}
