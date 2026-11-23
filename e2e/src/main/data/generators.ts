/**
 * Dynamic test data. Builders in entities/ and steps use these instead of literals, so every scenario and every
 * worker gets its own data and dates never go stale.
 */

/** Unique id per call: qa_<caseid>_<time><random>. Pass the case id when the step has it (helps find the data). */
export const uid = (caseId = 'x'): string =>
  `qa_${caseId.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Human-readable unique name: 'QA Household 1k3x9a'. */
export const unique = (prefix: string): string => `${prefix} ${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 4)}`;

export const email = (caseId = 'x'): string => `${uid(caseId)}@example.test`;

const iso = (d: Date): string => d.toISOString().slice(0, 10);
const shift = (days: number): Date => new Date(Date.now() + days * 86_400_000);

/** Dates relative to today, as ISO yyyy-mm-dd. Never hard-code a date in a builder or a step. */
export const dates = {
  today: (): string => iso(shift(0)),
  daysFromNow: (n: number): string => iso(shift(n)),
  daysAgo: (n: number): string => iso(shift(-n)),
  /** Full ISO timestamp n days from now (for date-time fields). */
  dateTimeFromNow: (n: number): string => shift(n).toISOString(),
  /**
   * Gherkin values: 'today', '+7d', '-3d' → ISO date; anything else is returned unchanged.
   * Lets a feature table override a default without hard-coding a date.
   */
  parse: (v: string): string => {
    if (v === 'today') return iso(shift(0));
    const m = v.match(/^([+-]\d+)d$/);
    return m ? iso(shift(Number(m[1]))) : v;
  },
};
