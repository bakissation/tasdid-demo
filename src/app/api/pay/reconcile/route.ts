import { getHandlers } from '@/lib/checkout';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * SATIM has no webhooks, so reconciliation is the source of truth: a guarded GET
 * a scheduler (or the admin button) hits to sweep pending payments. Auth is the
 * `authorize` hook in lib/checkout.ts (Bearer PAY_ADMIN_TOKEN) → 401 otherwise.
 */
export async function GET(request: Request): Promise<Response> {
  return getHandlers().reconcile(request);
}
