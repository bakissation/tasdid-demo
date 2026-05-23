# tasdid-demo

The reference storefront for the **[`@bakissation/*`](https://www.npmjs.com/org/bakissation) Algerian payments family** — a small but real shop that takes a **CIB / Edahabia** payment end-to-end, and the canonical example of how to **e2e-test SATIM payments in CI**.

It runs entirely against the **SATIM mock** ([`@bakissation/satim-testing`](https://github.com/bakissation/satim-testing)) — **no real money moves**, so it's safe to run and demo anywhere.

```bash
docker compose up
# → storefront on http://localhost:3000
# → SATIM simulator on http://localhost:8888
```

Buy the plan → pay on the (simulated) SATIM page with a **test card** → enter the **3-D Secure OTP** (`123456`) → land on a certification-correct status screen.

## What it demonstrates

- **The family, wired together:** [`tasdid`](https://github.com/bakissation/tasdid) (lifecycle + state machine + Redis store) · [`tasdid-adapters/fetch`](https://github.com/bakissation/tasdid-adapters) (route handlers) · [`satim`](https://github.com/bakissation/satim) (gateway client) · [`dinar`](https://github.com/bakissation/dinar) (money). See [`src/lib/checkout.ts`](src/lib/checkout.ts).
- **A SATIM-certification-correct return page** (modelled on a real certified app), with i18n (fr/en/ar + RTL) and dark mode.
- **How to test SATIM in CI:** a Playwright suite that walks the whole *cahier de recette* against the mock — see [`tests/e2e`](tests/e2e) and [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Architecture (`docker compose`)

```
                       ┌──────────── browser ────────────┐
                       │  localhost:3000   localhost:8888 │
                       ▼                                  ▼
   ┌───────────────────────────┐   register.do    ┌──────────────────┐
   │ app (Next.js App Router)   │ ───────────────▶ │ satim-mock        │
   │  tasdid + adapters + satim │ ◀─ getOrderStatus│ (@bakissation/    │
   └─────────────┬──────────────┘  (satim-mock:8888)│  satim-testing)  │
                 │ payments                          └──────────────────┘
                 ▼
          ┌────────────┐
          │ db (redis) │  tasdid createRedisStore
          └────────────┘
```

**The load-bearing split:** the app's *backend* calls SATIM at `http://satim-mock:8888` (compose-internal DNS), but the `formUrl` it gets back must be reachable by the *browser* — so the mock is started with `--public-url http://localhost:8888`. That's exactly the seam `--public-url` exists for.

## Payment flow

1. **`/`** — the "Pro" plan → **Buy**.
2. **`/checkout`** — summary + CGV checkbox → **Payer** → `POST /api/pay` (`checkout.start`, amount fixed server-side) → `{ redirectUrl }` → browser goes to SATIM.
3. **SATIM** (the mock here, real SATIM in prod) — card → **3-D Secure OTP** → redirect to our return URL with `?orderId=`.
4. **`/api/pay/return`** — `handleReturn` **reconfirms via `getOrderStatus`** (never trusts redirect params) → 303 to the status page.
5. **`/checkout/status`** — the success/failure screen below.
6. **Reconcile** — SATIM has no webhooks, so a guarded `GET /api/pay/reconcile` (a cron, the documented `curl`, or the **admin button** at `/admin`) sweeps pending payments.

The routes are one-liners over `@bakissation/tasdid-adapters/fetch` (`src/app/api/pay/*`).

## SATIM certification rules baked in

These come straight from a real SATIM certification thread (the mistakes that fail cert), enforced on [`src/app/checkout/status/page.tsx`](src/app/checkout/status/page.tsx):

| # | Rule | Where |
|---|------|-------|
| 1 | **Accepted** → show transaction id, order number, approval code, amount, date, mode | details grid, success only |
| 2 | **Rejected** → **hide** all transaction details | grid is `!isFailed` only |
| 3 | Error message = `respCodeDesc` → `actionCodeDescription` (a real reason, never a 500) | `error-reason` |
| 4 | Helpline = the **official branded 3020 image** (+ CIB/Edahabia logo), not just text | `public/assets/*` |
| 5 | The **order number** must be on the receipt | receipt download |
| 6 | **Uniform language** across summary → gateway → return → receipt | one locale drives the `language` param too |
| 7 | Redirect-only (SAQ-A); always `getOrderStatus`, never trust return params | `tasdid` enforces |

> The decline **reason** (`respCodeDesc`) only became renderable once `@bakissation/tasdid` exposed it on `PaymentResult.satim` — this app drove that feature.

## Testing

```bash
npm test            # Vitest unit — family lifecycle on the in-process mock, no network
docker compose up -d --build --wait
npx playwright test # e2e — walks the whole cahier de recette against satim-mock
```

The Playwright suite ([`tests/e2e/payment.spec.ts`](tests/e2e/payment.spec.ts)) drives **every certification card** plus refund + cancellation, asserting each lands on the correct screen. CI runs the **exact same compose stack** — zero drift between local and CI.

**Mock-only selectors:** the mock's payment page deliberately doesn't mirror SATIM's real DOM, so this suite passes against the simulator and *would fail against the live gateway* — by design. Automating a live hosted payment page is against payment norms; we never enable it.

## Reconcile

```bash
# what a cron would run; the /admin button does the same on demand
curl -H "Authorization: Bearer $PAY_ADMIN_TOKEN" http://localhost:3000/api/pay/reconcile
```

## Stack

Next.js (App Router) · TypeScript · Tailwind · Redis · the `@bakissation/*` family. **Not an npm package** — the "release" is a container image on GHCR (`ghcr.io/bakissation/tasdid-demo`), built on every push to `main`.

## License

MIT
