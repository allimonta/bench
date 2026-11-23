/** Formats an amount the way the shop shows it: US dollars, no cents ("$4,720"). */
export const formatUsd = (amount: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

/** Reads an amount the shop shows ("$4,720") as a number. */
export const parseUsd = (text: string): number => {
  const amount = Number(text.replace(/[^0-9.-]/g, ''));
  if (!text.trim() || Number.isNaN(amount)) throw new Error(`"${text}" is not an amount in dollars`);
  return amount;
};
