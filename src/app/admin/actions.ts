'use server';

import { reconcilePending } from '@bakissation/tasdid';
import { getCheckout, store } from '@/lib/checkout';

export interface ReconcileSummary {
  reconciled: number;
  paid: number;
  failed: number;
  expired: number;
  stillPending: number;
  errors: number;
}

/**
 * Run the reconcile sweep on demand (server-side, already trusted — no token).
 * SATIM has no webhooks, so in production a scheduler hits GET /api/pay/reconcile
 * (token-guarded); this button is the same sweep for the demo.
 */
export async function reconcileNow(): Promise<ReconcileSummary> {
  const s = await reconcilePending(getCheckout(), store(), { limit: 100 });
  return {
    reconciled: s.reconciled,
    paid: s.paid,
    failed: s.failed,
    expired: s.expired,
    stillPending: s.stillPending,
    errors: s.errors,
  };
}
