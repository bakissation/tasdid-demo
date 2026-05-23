import { describe, it, expect } from 'vitest';
import { Dinar } from '@bakissation/dinar';
import { createCheckout, createMemoryStore, reconcilePending } from '@bakissation/tasdid';
import { createMockSatim, testCards } from '@bakissation/satim-testing';

// Unit-level: drive the exact family the demo wires, with no network and no Redis.
const order = (n: string) => ({
  orderNumber: n,
  amount: Dinar.fromDinars(5000),
  returnUrl: 'http://app/api/pay/return',
  failUrl: 'http://app/api/pay/return',
});

const declined = Object.entries(testCards).filter(([, c]) => c.outcome === 'declined');

describe('payment lifecycle (mock gateway, no network)', () => {
  it('a valid card → paid with an approval code and masked PAN', async () => {
    const satim = createMockSatim({ autoSettle: false });
    const checkout = createCheckout({ satim, store: createMemoryStore() });
    const { paymentId, result } = await checkout.start(order('U1'));
    satim.pay(result.orderId!, { card: testCards.valid.pan });
    const r = await checkout.reconcile(paymentId);
    expect(r.status).toBe('paid');
    expect(r.paid).toBe(true);
    expect(r.satim.approvalCode).toBeTruthy();
    expect(r.satim.pan).toMatch(/\*{4}/);
  });

  // The cert-failure rule, per card: respCodeDesc carries the reason the screen renders.
  it.each(declined)('declined card "%s" → failed, surfaces its reason', async (name, card) => {
    const satim = createMockSatim({ autoSettle: false });
    const checkout = createCheckout({ satim, store: createMemoryStore() });
    const { paymentId, result } = await checkout.start(order(`D-${name}`));
    satim.pay(result.orderId!, { card: card.pan });
    const r = await checkout.reconcile(paymentId);
    expect(r.status).toBe('failed');
    expect(r.satim.respCodeDesc).toBe(card.reason);
  });

  it('a paid payment can be fully refunded', async () => {
    const satim = createMockSatim({ autoSettle: false });
    const checkout = createCheckout({ satim, store: createMemoryStore() });
    const { paymentId, result } = await checkout.start(order('R1'));
    satim.pay(result.orderId!, { card: testCards.valid.pan });
    await checkout.reconcile(paymentId);
    const r = await checkout.refund(paymentId);
    expect(r.status).toBe('refunded');
  });

  it('an abandoned order past its window → expired', async () => {
    const satim = createMockSatim({ autoSettle: false });
    const checkout = createCheckout({ satim, store: createMemoryStore() });
    const { paymentId, result } = await checkout.start(order('E1'));
    satim.expire(result.orderId!); // SATIM auto-cancels unconfirmed orders
    const r = await checkout.reconcile(paymentId);
    expect(r.status).toBe('expired');
  });

  it('start is idempotent on the same order number (never double-registers)', async () => {
    const checkout = createCheckout({ satim: createMockSatim(), store: createMemoryStore() });
    const a = await checkout.start(order('SAME'));
    const b = await checkout.start(order('SAME'));
    expect(b.paymentId).toBe(a.paymentId);
  });

  it('reconcilePending sweep classifies every pending payment', async () => {
    const satim = createMockSatim({ autoSettle: false });
    const store = createMemoryStore();
    const checkout = createCheckout({ satim, store });
    const p1 = await checkout.start(order('S1'));
    const p2 = await checkout.start(order('S2'));
    satim.pay(p1.result.orderId!, { card: testCards.valid.pan });
    satim.pay(p2.result.orderId!, { card: testCards.stolen.pan });
    const summary = await reconcilePending(checkout, store);
    expect(summary.reconciled).toBe(2);
    expect(summary.paid).toBe(1);
    expect(summary.failed).toBe(1);
  });
});
