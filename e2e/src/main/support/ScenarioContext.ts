import type { ShopProduct } from '@data/products';

/**
 * Keys a scenario can share between steps, with their types. QACluster codegen adds one entry per entity it stores,
 * e.g. `household: Household;`. Untyped string keys still work (`ctx.get<T>('key')`), typed keys are preferred.
 */
export interface ContextData {
  /** The products this scenario put in the cart, in the order it added them. */
  cartProducts: ShopProduct[];
  /** How many products the shop listed before a filter was applied. */
  productCountBefore: number;
  /** The cart counter in the header before the scenario's action. */
  cartCountBefore: number;
  /** The cart total before a discount code was applied. */
  cartTotalBefore: number;
  /** The stock state ("Out of stock") of the product the scenario looks at. */
  stockStatus: string;
  /** The product whose details the scenario opened. */
  viewedProduct: ShopProduct;
}

/**
 * How a cleanup runs. `api` is allowed only when another scenario validates that same delete through the UI and runs
 * in the suite: name it in `uiCoveredBy` (its case id, e.g. 'TC-ITEMDEL-001'). That scenario keeps its UI delete;
 * only the API delete is reused here. Without such a scenario, clean up through the UI.
 */
export type CleanupVia = { via: 'ui' } | { via: 'api'; uiCoveredBy: string };

type Cleanup = { label: string; run: () => Promise<unknown> } & CleanupVia;

const MINUTE = 60_000;
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** The first line of whatever was thrown (an Error, a string, an object) */
const firstLine = (e: unknown): string => (e instanceof Error ? e.message : typeof e === 'string' ? e : JSON.stringify(e) ?? String(e)).split('\n')[0];

/**
 * Shared state for ONE scenario (the PicoContainer "World" equivalent).
 * Injected as the `ctx` fixture: every step file that asks for `ctx` in the same scenario gets the SAME instance;
 * the next scenario gets a fresh one. Never keep state in module-level variables or statics.
 * Whatever a step creates (by UI or by API) registers its cleanup here; they run in reverse order after the scenario.
 */
export class ScenarioContext {
  private readonly store = new Map<string, unknown>();
  private readonly cleanups: Cleanup[] = [];
  private readonly notCleanedBefore: string[] = [];
  private readonly created = new Set<string>();
  // the minute it was made (base36) + 4 random characters: a clean-before can tell an old leftover from a live value
  private readonly suffix = `${Math.floor(Date.now() / MINUTE).toString(36)}${Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * 36)]).join('')}`;

  /**
   * The value this scenario writes for a Gherkin value that names something the scenario creates (an account, a title).
   * The Gherkin value is the fixed prefix and this scenario's suffix makes it its own, so two executions never write the
   * same one: "qa_writer" → "qa_writer_tfk2xab12", "qa.writer@example.com" → "qa.writer_tfk2xab12@example.com" (only an
   * email keeps its domain). Within the scenario the same Gherkin value always gives the same result.
   */
  own(value: string): string {
    this.created.add(value);
    const at = EMAIL.test(value) ? value.lastIndexOf('@') : -1;
    return at > 0 ? `${value.slice(0, at)}_${this.suffix}${value.slice(at)}` : `${value}_${this.suffix}`;
  }

  /**
   * What a step that reads a value looks for: `own(value)` when a step of this scenario created it, the value as written
   * otherwise (a seeded user, an account another scenario's Given signed in with). One step serves both scenarios.
   */
  read(value: string): string {
    return this.created.has(value) ? this.own(value) : value;
  }

  /** What every `own(value)` starts with: what a page searches its list with before `leftovers` picks. */
  static leftoverPrefix(value: string): string {
    const at = EMAIL.test(value) ? value.lastIndexOf('@') : -1;
    return `${at > 0 ? value.slice(0, at) : value}_`;
  }

  /**
   * Of the values a page found (`found`, by `leftoverPrefix`), the ones an earlier execution of `value` left behind: the
   * exact shape of `own(value)` and made more than an hour ago — never what another feature, job or repetition has just
   * created, never `qa_writer_admin_…` for "qa_writer" —, at most `max` (the rest waits for the next execution).
   */
  static leftovers(value: string, found: string[], { now = Date.now(), olderThanMinutes = 60, max = 5 } = {}): string[] {
    const at = EMAIL.test(value) ? value.lastIndexOf('@') : -1;
    const base = at > 0 ? value.slice(0, at) : value; const domain = at > 0 ? value.slice(at) : '';
    const shape = new RegExp(`^${escapeRe(base)}_([0-9a-z]{5})[0-9a-z]{4}${escapeRe(domain)}$`);
    return found.filter((f) => {
      const m = shape.exec(f);
      return !!m && Math.floor(now / MINUTE) - parseInt(m[1], 36) >= olderThanMinutes;
    }).slice(0, max);
  }

  /**
   * Clean before creating: delete what earlier executions left behind — the page finds by `leftoverPrefix(value)` and
   * deletes only `leftovers(value, found)`, never "all". It runs at the same time as other features, jobs and repetitions:
   * what they create is not a leftover yet. A failure does not fail the case: it is reported with the failed cleanups.
   */
  async cleanBefore(label: string, how: CleanupVia, run: () => Promise<unknown>): Promise<void> {
    try {
      await run();
    } catch (e) {
      this.notCleanedBefore.push(`${label} (${how.via}, before): ${firstLine(e)}`);
    }
  }

  set<K extends keyof ContextData>(key: K, value: ContextData[K]): void;
  set<T>(key: string, value: T): void;
  set(key: string, value: unknown): void {
    this.store.set(key, value);
  }

  get<K extends keyof ContextData>(key: K): ContextData[K];
  get<T>(key: string): T;
  get(key: string): unknown {
    if (!this.store.has(key)) throw new Error(`ScenarioContext: "${key}" was not set by a previous step`);
    return this.store.get(key);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  /** Register how to undo something this scenario created. Runs after the scenario, last registered first. */
  onCleanup(label: string, how: CleanupVia, run: () => Promise<unknown>): void {
    this.cleanups.push({ label, run, ...how });
  }

  /**
   * The scenario itself undid what a cleanup would undo (e.g. it deleted the article it published): that cleanup is
   * dropped, so it does not try to delete something that is already gone.
   */
  doneByScenario(label: string): void {
    // the most recent one with that label: cleanups run last-first, and a scenario that created two of a kind deletes the
    // last one it created (review of PR #133, finding 5)
    for (let at = this.cleanups.length - 1; at >= 0; at--) {
      if (this.cleanups[at].label === label) { this.cleanups.splice(at, 1); return; }
    }
  }

  /** Runs every cleanup even if one fails; returns the failures (they are reported, they do not fail the case). */
  async runCleanups(): Promise<string[]> {
    const failed: string[] = this.notCleanedBefore.splice(0);
    for (const c of this.cleanups.splice(0).reverse()) {
      try {
        const r = (await c.run()) as { ok?: () => boolean; status?: () => number } | undefined;
        // An API cleanup returns the APIResponse: a 4xx/5xx is a failed cleanup too
        if (typeof r?.ok === 'function' && !r.ok()) throw new Error(`HTTP ${r.status?.()}`);
      } catch (e) {
        failed.push(`${c.label} (${c.via}): ${firstLine(e)}`);
      }
    }
    return failed;
  }
}
