import { NextResponse } from 'next/server';
import { Dinar } from '@bakissation/dinar';
import { generateOrderNumber } from '@bakissation/tasdid';
import { APP_URL, getCheckout } from '@/lib/checkout';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n';
import { PLAN } from '@/lib/plan';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Start a payment. The storefront only tells us the language; the amount, order
 * number and return URL are fixed server-side — never trust a price that came
 * from the client. (This is why we call `checkout.start` directly instead of
 * wiring `export const POST = handlers.start`, which would read them from the body.)
 */
export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as { language?: unknown };
  const language = isLocale(body.language) ? body.language : DEFAULT_LOCALE;
  const returnUrl = `${APP_URL}/api/pay/return`;

  try {
    const { paymentId, redirectUrl } = await getCheckout().start({
      orderNumber: generateOrderNumber(),
      amount: Dinar.fromDinars(PLAN.amountDinars),
      returnUrl,
      failUrl: returnUrl,
      description: `Tasdid ${PLAN.id}`,
      language,
    });
    return NextResponse.json({ paymentId, redirectUrl });
  } catch {
    return NextResponse.json({ error: 'Unable to start the payment' }, { status: 502 });
  }
}
