import { getHandlers } from '@/lib/checkout';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Token-guarded refund (full or partial). Body: { paymentId, amount?, idempotencyKey? }. */
export async function POST(request: Request): Promise<Response> {
  return getHandlers().refund(request);
}
