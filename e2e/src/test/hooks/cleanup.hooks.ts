import { After } from '@fixtures';

/**
 * Undo what the scenario created (registered with ctx.onCleanup), last first, while the page is still open.
 * A failed cleanup does not fail the case: it is reported as a `cleanup-failed` annotation.
 */
After(async ({ ctx, $testInfo }) => {
  const failed = await ctx.runCleanups();
  for (const f of failed) $testInfo.annotations.push({ type: 'cleanup-failed', description: f });
});
