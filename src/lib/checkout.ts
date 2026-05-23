import 'server-only';
import { Redis } from 'ioredis';
import {
  createCheckout,
  createRedisStore,
  type Checkout,
  type PaymentStore,
} from '@bakissation/tasdid';
import { createSatimClient, fromEnv } from '@bakissation/satim';
import { createFetchHandlers, type FetchHandlers } from '@bakissation/tasdid-adapters/fetch';

/**
 * The whole family wired together, once:
 *   ioredis ── createRedisStore ──┐
 *                                 ├── createCheckout ── createFetchHandlers
 *   fromEnv ── createSatimClient ─┘
 *
 * Everything is lazy so `next build` never needs SATIM creds, and so dev HMR
 * reuses a single Redis connection (cached on globalThis).
 */

const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';
const ADMIN_TOKEN = process.env.PAY_ADMIN_TOKEN ?? 'dev-admin-token';

const cache = globalThis as unknown as {
  __redis?: Redis;
  __store?: PaymentStore;
  __checkout?: Checkout;
  __handlers?: FetchHandlers;
};

function redis(): Redis {
  cache.__redis ??= new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
  return cache.__redis;
}

export function store(): PaymentStore {
  cache.__store ??= createRedisStore(redis());
  return cache.__store;
}

/** The merchant's SATIM checkout — direct model: our own creds, money settles to us. */
export function getCheckout(): Checkout {
  cache.__checkout ??= createCheckout({
    satim: createSatimClient(fromEnv()),
    store: store(),
  });
  return cache.__checkout;
}

/**
 * Route-ready handlers over the Web Fetch API. `handleReturn` reconfirms via the
 * gateway and 303s to the status page; `reconcile`/`refund` are token-guarded.
 * successUrl and failUrl point at the same status page — it renders the outcome
 * from the reconciled payment, never from redirect params.
 */
export function getHandlers(): FetchHandlers {
  cache.__handlers ??= createFetchHandlers(getCheckout(), {
    // The adapter appends `?payment=<id>` itself — don't add it here (it would double up).
    successUrl: `${APP_URL}/checkout/status`,
    failUrl: `${APP_URL}/checkout/status`,
    store: store(),
    authorize: ({ headers }) => headers.authorization === `Bearer ${ADMIN_TOKEN}`,
  });
  return cache.__handlers;
}

export { APP_URL };
