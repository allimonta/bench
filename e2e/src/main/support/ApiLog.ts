import type { APIResponse, TestInfo } from '@playwright/test';

type Entry = { method: string; url: string; status: number; request?: unknown; response?: string };

const SECRET = /"(password|pass|token|secret|authorization|apiKey|api_key)"\s*:\s*"[^"]*"/gi;
const redact = (s: string): string => s.replace(SECRET, '"$1":"***"');

/**
 * Every API call of one scenario. Attached to the test as `api-calls.json` when the scenario used the API,
 * so a failed preparation ("precondition blocked") has its request and response as evidence.
 * Bodies are kept only for responses >= 400, truncated, with secrets redacted.
 */
export class ApiLog {
  private readonly entries: Entry[] = [];

  async record(method: string, url: string, request: unknown, res: APIResponse): Promise<void> {
    const entry: Entry = { method, url, status: res.status() };
    if (res.status() >= 400) {
      entry.request = request === undefined ? undefined : JSON.parse(redact(JSON.stringify(request)));
      entry.response = redact((await res.text().catch(() => '')).slice(0, 2_000));
    }
    this.entries.push(entry);
  }

  async attach(testInfo: TestInfo): Promise<void> {
    if (!this.entries.length) return;
    await testInfo.attach('api-calls.json', { body: JSON.stringify(this.entries, null, 2), contentType: 'application/json' });
  }
}
