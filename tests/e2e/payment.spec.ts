import { expect, test, type Page } from '@playwright/test';
import { testCards } from '@bakissation/satim-testing';

const ADMIN_TOKEN = 'dev-admin-token'; // matches docker-compose PAY_ADMIN_TOKEN

/**
 * Drive the storefront → checkout → SATIM mock page → 3-D Secure OTP → return.
 * The mock page's selectors (#pan, #mock-pay, #otp, …) deliberately do NOT match
 * real SATIM's DOM, so this suite passes against the simulator and would fail
 * against the live gateway — by design (SATIM forbids botting its page).
 */
async function reachGateway(page: Page) {
  await page.goto('/');
  await page.getByTestId('buy').click();
  await page.waitForURL('**/checkout');
  await page.getByTestId('cgv').check();
  await page.getByTestId('pay').click();
  await page.waitForURL('**/pay**'); // the mock hosted page (cross-origin :8888)
}

async function payCard(page: Page, pan: string, otp = '123456') {
  await reachGateway(page);
  await page.fill('#pan', pan);
  await page.fill('#expiry', '01/2027');
  await page.fill('#cvv', '123');
  await page.click('#mock-pay');
  await page.waitForSelector('#otp');
  await page.fill('#otp', otp);
  await page.click('#mock-otp-confirm');
  await page.waitForURL('**/checkout/status**');
}

function paymentId(page: Page): string {
  return new URL(page.url()).searchParams.get('payment') ?? '';
}

// ── Cert rules, called out explicitly (the "why") ──────────────────────────────
test.describe('SATIM certification rules', () => {
  test('accepted payment shows the transaction details + a downloadable receipt', async ({ page }) => {
    await payCard(page, testCards.valid.pan);
    await expect(page.getByTestId('status-success')).toBeVisible();
    await expect(page.getByTestId('tx-details')).toBeVisible(); // rule #1
    await expect(page.getByTestId('receipt-download')).toBeEnabled();
  });

  test('rejected payment hides the details, shows the reason + the branded 3020 image', async ({ page }) => {
    await payCard(page, testCards.stolen.pan);
    await expect(page.getByTestId('status-failed')).toBeVisible();
    await expect(page.getByTestId('error-reason')).toBeVisible(); // rule #3: real reason
    await expect(page.getByTestId('tx-details')).toHaveCount(0); // rule #2: details hidden
    await expect(page.getByAltText(/3020/i)).toBeVisible(); // rule #4: branded helpline image
    await expect(page.getByTestId('receipt-download')).toBeDisabled();
  });

  test('three wrong OTPs → declined', async ({ page }) => {
    await reachGateway(page);
    await page.fill('#pan', testCards.valid.pan);
    await page.click('#mock-pay');
    await page.waitForSelector('#otp');
    for (let i = 0; i < 3; i++) {
      await page.fill('#otp', '000000');
      await page.click('#mock-otp-confirm');
    }
    await page.waitForURL('**/checkout/status**');
    await expect(page.getByTestId('status-failed')).toBeVisible();
  });
});

// ── The full cahier de recette: every certification card ──────────────────────
test.describe('cahier de recette — every certification card', () => {
  for (const [name, card] of Object.entries(testCards)) {
    test(`${name} — ${card.reason} → ${card.outcome}`, async ({ page }) => {
      await payCard(page, card.pan);
      if (card.outcome === 'approved') {
        await expect(page.getByTestId('status-success')).toBeVisible();
        await expect(page.getByTestId('tx-details')).toBeVisible();
      } else {
        await expect(page.getByTestId('status-failed')).toBeVisible();
        await expect(page.getByTestId('tx-details')).toHaveCount(0);
        await expect(page.getByTestId('error-reason')).toBeVisible();
      }
    });
  }
});

// ── The two non-card cahier rows: remboursement + annulation ──────────────────
test.describe('cahier de recette — refund + cancellation', () => {
  test('remboursement — pay then refund via the admin API', async ({ page }) => {
    await payCard(page, testCards.valid.pan);
    await expect(page.getByTestId('status-success')).toBeVisible();
    const res = await page.request.post('/api/pay/refund', {
      headers: { authorization: `Bearer ${ADMIN_TOKEN}` },
      data: { paymentId: paymentId(page) },
    });
    expect(res.ok()).toBeTruthy();
    expect((await res.json()).status).toBe('refunded');
  });

  test('annulation — cancel on the gateway page → failure', async ({ page }) => {
    await reachGateway(page);
    await page.fill('#pan', testCards.valid.pan);
    await page.click('#mock-cancel');
    await page.waitForURL('**/checkout/status**');
    await expect(page.getByTestId('status-failed')).toBeVisible();
  });
});
