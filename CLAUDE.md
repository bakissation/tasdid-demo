# CLAUDE.md — maintainer guide for tasdid-demo

The flagship **reference app** for the `@bakissation/*` Algerian payments family: a real CIB/Edahabia storefront end-to-end, and the canonical example of **e2e-testing SATIM in CI** against `@bakissation/satim-testing`. Maintainer: Abdelbaki Berkati ([@bakissation](https://github.com/bakissation)).

**An app, not a package.** `"private": true`; never published to npm. Runs entirely on the mock — no real money.

## The soul (invariants)

1. **Faithful backend, mock-only page.** The REST wire is identical real-vs-mock, so a merchant's backend is the same in prod. But the mock's *page* selectors don't mirror real SATIM — the e2e passes here and would fail against the live gateway. Never wire the suite to drive real SATIM (botting a hosted payment page is against payment norms).
2. **Never trust the client price.** `start` fixes the amount/order number/return URL server-side (`src/app/api/pay/route.ts`) — that's why it calls `checkout.start` directly instead of `export const POST = handlers.start`.
3. **Reconciliation is the source of truth.** No webhooks; the return page reconfirms via `getOrderStatus` (tasdid does this), and `/api/pay/reconcile` is the guarded sweep.
4. **Cert-correctness is the point.** The status screen obeys the SATIM cert rules (details on success only; reason + branded 3020 image on failure; order number on the receipt; uniform language). If you change it, keep the table in the README true.

## Layout

- `src/lib/checkout.ts` — the whole family wired once (lazy singletons: ioredis → `createRedisStore` → `createCheckout`; `fromEnv` → `createSatimClient`; `createFetchHandlers`). Server-only.
- `src/app/api/pay/*` — `start` (custom, server-fixed), `return`/`reconcile`/`refund` (one-liners over `tasdid-adapters/fetch`).
- `src/app/checkout/status/page.tsx` — the cert-correct return screen (the most important UI).
- `src/lib/i18n.ts` — fr/en/ar dictionaries (+ RTL); the locale also drives the SATIM `language` param (cert rule #6).
- `tests/unit` (Vitest, in-process mock) · `tests/e2e` (Playwright vs the `satim-mock` container).

## Release model

Trunk-based on `main` (protected). Conventional Commits for hygiene, **no** semantic-release. CI (`.github/workflows/ci.yml`) is the showcase: `quality` (lint/typecheck/build/unit) + `e2e` (the same `docker compose` stack + Playwright). "Release" = a GHCR image (`release.yml`) on `main`/tags — not npm.

## Family deps

`@bakissation/satim` ^2 · `tasdid` ^1.3 (needs `PaymentResult.satim.respCodeDesc`) · `tasdid-adapters` ^1.2 · `dinar` ^1.1 · `satim-testing` ^1.2 (dev, needs the decline-reason passthrough) · `ioredis`.

## Commands

```bash
docker compose up            # the demo: app + redis + satim-mock
npm run dev                  # app only (needs a local redis + `npx satim-mock`)
npm run lint && npm run typecheck && npm run build && npm test
docker compose up -d --build --wait && npx playwright test   # e2e
```

## Spec

Vault: `projects/dzts/demo-app.md`.
