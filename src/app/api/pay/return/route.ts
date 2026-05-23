import { getHandlers } from '@/lib/checkout';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Where SATIM redirects the buyer (`?orderId=…`). handleReturn reconfirms the
 * outcome against the gateway — it never trusts the redirect params — then 303s
 * to the status page. The whole binding is one line.
 */
export async function GET(request: Request): Promise<Response> {
  return getHandlers().handleReturn(request);
}
