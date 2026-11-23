/** A product as the shop shows it, read from its card when a step uses it. */
export type ShopProduct = { id: string; name: string; price: number; description: string };

/**
 * Products of the app's catalog that steps use when the scenario does not name one.
 * fixed number: 'opt-01' / 'arm-02' are the product ids written in the app's PRODUCTS catalog (index.html), not
 * generated per run.
 */
export const products = {
  /** Any product: the scenario only needs one. */
  any: 'opt-01',
  /** A second product, different from `any`. */
  another: 'arm-02',
} as const;

/** A category the shop offers, for a scenario that applies "a category filter" without naming one. */
export const anyCategory = 'Sensors';
